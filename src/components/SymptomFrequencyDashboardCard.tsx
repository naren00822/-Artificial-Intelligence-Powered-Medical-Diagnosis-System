import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  BarChart2, 
  Activity, 
  Layers, 
  Filter, 
  Flame, 
  Sparkles, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  History,
  RotateCcw,
  Stethoscope
} from 'lucide-react';
import { SavedAssessment, Symptom } from '../types';
import { SYMPTOMS_DATASET } from '../data/medicalData';
import { saveAssessmentToHistory, getAssessmentHistory } from '../services/historyStorage';
import { runMedicalDiagnosis } from '../services/diagnosisEngine';
import { CLINICAL_CASE_VIGNETTES } from '../data/clinicalVignettes';

interface SymptomFrequencyItem {
  id: string;
  name: string;
  category: string;
  severityWeight: number;
  count: number;
  percentage: number;
  associatedDiseases: string[];
  assessmentDates: string[];
}

interface SymptomFrequencyDashboardCardProps {
  history: SavedAssessment[];
  onHistoryChange?: (updatedHistory: SavedAssessment[]) => void;
  onSelectSymptom?: (symptomId: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'General': '#0d9488', // teal-600
  'Respiratory': '#0284c7', // sky-600
  'Cardiovascular': '#e11d48', // rose-600
  'Gastrointestinal': '#d97706', // amber-600
  'Neurological': '#6366f1', // indigo-500
  'Dermatological': '#c026d3', // fuchsia-600
  'Musculoskeletal': '#059669', // emerald-600
};

export const SymptomFrequencyDashboardCard: React.FC<SymptomFrequencyDashboardCardProps> = ({
  history,
  onHistoryChange,
  onSelectSymptom
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'frequency' | 'severity' | 'alphabetical'>('frequency');
  const [topLimit, setTopLimit] = useState<number>(10);
  const [hoveredItem, setHoveredItem] = useState<{
    item: SymptomFrequencyItem;
    x: number;
    y: number;
  } | null>(null);

  // ResizeObserver for dynamic, responsive width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(Math.floor(entry.contentRect.width));
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute symptom occurrences across history records
  const frequencyData: SymptomFrequencyItem[] = useMemo(() => {
    if (!history || history.length === 0) return [];

    const symptomMap = new Map<string, Symptom>();
    SYMPTOMS_DATASET.forEach(s => symptomMap.set(s.id, s));

    const counts = new Map<string, { 
      count: number; 
      diseases: Set<string>; 
      dates: string[]; 
    }>();

    history.forEach(assessment => {
      const res = assessment.result;
      const primaryDiseaseName = res.primaryDiagnosis?.disease?.name || 'Unknown';
      const dateStr = assessment.formattedDate || 'Recent';

      res.selectedSymptoms.forEach(symId => {
        if (!counts.has(symId)) {
          counts.set(symId, { count: 0, diseases: new Set(), dates: [] });
        }
        const item = counts.get(symId)!;
        item.count += 1;
        item.diseases.add(primaryDiseaseName);
        if (!item.dates.includes(dateStr)) {
          item.dates.push(dateStr);
        }
      });
    });

    const totalAssessments = history.length;
    const items: SymptomFrequencyItem[] = [];

    counts.forEach((val, symId) => {
      const sym = symptomMap.get(symId);
      const name = sym ? sym.name : symId.replace(/_/g, ' ');
      const category = sym ? sym.category : 'General';
      const severityWeight = sym ? sym.severityWeight : 2;

      items.push({
        id: symId,
        name,
        category,
        severityWeight,
        count: val.count,
        percentage: Math.round((val.count / totalAssessments) * 100),
        associatedDiseases: Array.from(val.diseases),
        assessmentDates: val.dates
      });
    });

    return items;
  }, [history]);

  // Filter and sort items
  const displayItems = useMemo(() => {
    let filtered = frequencyData;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'frequency') {
        if (b.count !== a.count) return b.count - a.count;
        return b.severityWeight - a.severityWeight;
      }
      if (sortBy === 'severity') {
        if (b.severityWeight !== a.severityWeight) return b.severityWeight - a.severityWeight;
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    });

    return topLimit === 0 ? sorted : sorted.slice(0, topLimit);
  }, [frequencyData, selectedCategory, sortBy, topLimit]);

  // Key KPI summary metrics
  const summaryMetrics = useMemo(() => {
    const totalAssessments = history.length;
    const uniqueSymptoms = frequencyData.length;

    let mostPrevalent = frequencyData.length > 0 
      ? [...frequencyData].sort((a, b) => b.count - a.count)[0] 
      : null;

    // Dominant Category
    const categoryCounts: Record<string, number> = {};
    frequencyData.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + item.count;
    });

    let topCategory = 'None';
    let topCategoryCount = 0;
    Object.entries(categoryCounts).forEach(([cat, c]) => {
      if (c > topCategoryCount) {
        topCategory = cat;
        topCategoryCount = c;
      }
    });

    return {
      totalAssessments,
      uniqueSymptoms,
      mostPrevalent,
      topCategory,
      topCategoryCount
    };
  }, [history, frequencyData]);

  // Render D3 Horizontal Bar Chart
  useEffect(() => {
    if (!svgRef.current || displayItems.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const isCompact = containerWidth < 500;
    const margin = { 
      top: 15, 
      right: isCompact ? 55 : 85, 
      bottom: 25, 
      left: isCompact ? 115 : 180 
    };

    const rowHeight = 36;
    const height = Math.max(160, displayItems.length * rowHeight + margin.top + margin.bottom);
    const width = Math.max(300, containerWidth);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const maxCount = Math.max(1, d3.max(displayItems, (d: SymptomFrequencyItem) => d.count) || 1);
    const totalAssessments = Math.max(1, history.length);

    // X Scale: mapped to max assessments or max count
    const xScale = d3.scaleLinear()
      .domain([0, Math.max(maxCount, Math.min(totalAssessments, maxCount + 1))])
      .range([0, innerWidth])
      .nice();

    // Y Scale: mapped to symptom names
    const yScale = d3.scaleBand()
      .domain(displayItems.map(d => d.id))
      .range([0, innerHeight])
      .padding(0.28);

    // Subtle background vertical grid lines
    const xTicks = xScale.ticks(Math.min(6, Math.max(2, maxCount)));
    g.append('g')
      .attr('class', 'grid-lines')
      .selectAll('line')
      .data(xTicks)
      .enter()
      .append('line')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#f1f5f9')
      .attr('stroke-dasharray', '3,3');

    // X Axis at the bottom
    const xAxis = d3.axisBottom(xScale)
      .ticks(Math.min(6, Math.max(2, maxCount)))
      .tickFormat(d => `${d}`)
      .tickSizeOuter(0);

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .call(gAxis => gAxis.select('.domain').attr('stroke', '#cbd5e1'))
      .call(gAxis => gAxis.selectAll('.tick line').attr('stroke', '#cbd5e1'))
      .call(gAxis => gAxis.selectAll('.tick text')
        .attr('fill', '#64748b')
        .attr('font-size', '10px')
        .attr('font-weight', '500')
      );

    // X Axis Label
    g.append('text')
      .attr('x', innerWidth)
      .attr('y', innerHeight + 20)
      .attr('text-anchor', 'end')
      .attr('fill', '#94a3b8')
      .attr('font-size', '9px')
      .attr('font-weight', '600')
      .text('Assessments Reported');

    // Bar Groups
    const barGroups = g.selectAll('.bar-group')
      .data(displayItems)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (d: SymptomFrequencyItem) => `translate(0, ${yScale(d.id) || 0})`)
      .style('cursor', onSelectSymptom ? 'pointer' : 'default')
      .on('click', (_, d: SymptomFrequencyItem) => {
        if (onSelectSymptom) {
          onSelectSymptom(d.id);
        }
      })
      .on('mouseenter', (event: MouseEvent, d: SymptomFrequencyItem) => {
        const [x, y] = d3.pointer(event, containerRef.current);
        setHoveredItem({ item: d, x, y });
      })
      .on('mousemove', (event: MouseEvent, d: SymptomFrequencyItem) => {
        const [x, y] = d3.pointer(event, containerRef.current);
        setHoveredItem({ item: d, x, y });
      })
      .on('mouseleave', () => {
        setHoveredItem(null);
      });

    // 1. Subtle Background Track (Denominator)
    barGroups.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', innerWidth)
      .attr('height', yScale.bandwidth())
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', '#f8fafc')
      .attr('stroke', '#f1f5f9');

    // 2. Main Animated Frequency Bar
    const bars = barGroups.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', yScale.bandwidth())
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', (d: any) => CATEGORY_COLORS[(d as SymptomFrequencyItem).category] || '#0d9488')
      .attr('opacity', 0.88);

    bars.transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .attr('width', (d: any) => Math.max(3, xScale((d as SymptomFrequencyItem).count)));

    // 3. Category Color Accent Pip
    barGroups.append('circle')
      .attr('cx', -10)
      .attr('cy', yScale.bandwidth() / 2)
      .attr('r', 3)
      .attr('fill', (d: any) => CATEGORY_COLORS[(d as SymptomFrequencyItem).category] || '#0d9488');

    // 4. Symptom Name Label on Y-axis (truncated if needed)
    barGroups.append('text')
      .attr('x', -18)
      .attr('y', yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('fill', '#1e293b')
      .attr('font-size', isCompact ? '10px' : '11px')
      .attr('font-weight', '600')
      .text((d: any) => {
        const item = d as SymptomFrequencyItem;
        const maxChars = isCompact ? 16 : 24;
        return item.name.length > maxChars ? item.name.slice(0, maxChars - 1) + '…' : item.name;
      });

    // 5. Value Label (Count and Percentage)
    barGroups.append('text')
      .attr('x', (d: any) => Math.max(3, xScale((d as SymptomFrequencyItem).count)) + 6)
      .attr('y', yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start')
      .attr('fill', '#475569')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .text((d: any) => {
        const item = d as SymptomFrequencyItem;
        return `${item.count}× (${item.percentage}%)`;
      });

  }, [displayItems, containerWidth, history.length, onSelectSymptom]);

  // Helper to load sample history so user can experience the D3 chart immediately
  const handleSeedSampleHistory = () => {
    let currentHistory = getAssessmentHistory();
    CLINICAL_CASE_VIGNETTES.slice(0, 4).forEach((vignette) => {
      const profile = {
        ...vignette.patientDemographics,
        preExistingConditions: ['None'],
        vitals: vignette.vitals
      };
      const result = runMedicalDiagnosis(vignette.symptoms, profile);
      currentHistory = saveAssessmentToHistory(result, `Vignette: ${vignette.title}`);
    });

    if (onHistoryChange) {
      onHistoryChange(currentHistory);
    }
  };

  const categories = ['All', 'General', 'Respiratory', 'Cardiovascular', 'Gastrointestinal', 'Neurological', 'Dermatological', 'Musculoskeletal'];

  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
    >
      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Historical Symptom Frequency Analysis
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  D3.js Visualization
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Aggregated prevalence and frequency distribution of symptoms logged across your local assessment history.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {history.length === 0 && (
              <button
                type="button"
                id="seed-demo-history-btn"
                onClick={handleSeedSampleHistory}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
                title="Populate with 4 sample clinical vignettes"
              >
                <Sparkles className="w-3 h-3 text-teal-600" />
                <span>Seed Sample History</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label={isCollapsed ? 'Expand frequency chart' : 'Collapse frequency chart'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* KPI Stats Row */}
        {!isCollapsed && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3.5 border-t border-slate-200/80">
            <div className="p-2.5 bg-slate-50/70 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Total Assessments
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg font-bold text-slate-900">{summaryMetrics.totalAssessments}</span>
                <span className="text-[10px] text-slate-500">recorded</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50/70 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Unique Symptoms
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg font-bold text-teal-700">{summaryMetrics.uniqueSymptoms}</span>
                <span className="text-[10px] text-slate-500">distinct</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50/70 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Most Prevalent
              </span>
              <div className="mt-0.5 truncate" title={summaryMetrics.mostPrevalent ? `${summaryMetrics.mostPrevalent.name} (${summaryMetrics.mostPrevalent.count}x)` : 'None'}>
                <span className="text-xs font-bold text-slate-900 truncate block">
                  {summaryMetrics.mostPrevalent ? summaryMetrics.mostPrevalent.name : 'N/A'}
                </span>
                {summaryMetrics.mostPrevalent && (
                  <span className="text-[10px] font-semibold text-teal-600">
                    {summaryMetrics.mostPrevalent.count}× ({summaryMetrics.mostPrevalent.percentage}%)
                  </span>
                )}
              </div>
            </div>

            <div className="p-2.5 bg-slate-50/70 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Top System
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xs font-bold text-slate-900">{summaryMetrics.topCategory}</span>
                {summaryMetrics.topCategoryCount > 0 && (
                  <span className="text-[10px] text-slate-500">
                    ({summaryMetrics.topCategoryCount} hits)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collapsible Chart Body */}
      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Controls: Category Filter, Sort By, Top Limit */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-slate-400" />
                System:
              </span>
              {categories.map(cat => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sorting & Limit Selectors */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center gap-1">
                <label htmlFor="symptom-sort-select" className="text-[11px] text-slate-500 font-medium">Sort:</label>
                <select
                  id="symptom-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-hidden"
                >
                  <option value="frequency">By Frequency</option>
                  <option value="severity">By Severity</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <label htmlFor="symptom-limit-select" className="text-[11px] text-slate-500 font-medium">Show:</label>
                <select
                  id="symptom-limit-select"
                  value={topLimit}
                  onChange={(e) => setTopLimit(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-hidden"
                >
                  <option value={5}>Top 5</option>
                  <option value={10}>Top 10</option>
                  <option value={15}>Top 15</option>
                  <option value={0}>All Reported</option>
                </select>
              </div>
            </div>
          </div>

          {/* D3 SVG Canvas or Empty State */}
          {history.length === 0 ? (
            <div className="bg-slate-50/60 rounded-xl border border-dashed border-slate-300 p-8 text-center my-2">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2.5">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">No Assessment History to Chart Yet</h4>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                As you run clinical symptom evaluations or test patient vignettes, this D3 chart will visualize symptom occurrence frequencies and organ system distribution.
              </p>
              <button
                type="button"
                onClick={handleSeedSampleHistory}
                className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Assessments for Demo</span>
              </button>
            </div>
          ) : displayItems.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
              No symptoms match the selected &quot;{selectedCategory}&quot; system category in your history.
            </div>
          ) : (
            <div className="relative border border-slate-100 rounded-lg p-2 bg-white overflow-hidden">
              {/* D3 SVG Container */}
              <div className="w-full overflow-x-auto">
                <svg ref={svgRef} className="w-full block" />
              </div>

              {/* Floating Tooltip */}
              {hoveredItem && (
                <div 
                  className="pointer-events-none absolute z-20 bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-xl border border-slate-800 space-y-1 transition-transform"
                  style={{
                    left: `${Math.min(hoveredItem.x + 12, containerWidth - 210)}px`,
                    top: `${Math.max(10, hoveredItem.y - 40)}px`,
                    width: '200px'
                  }}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-white truncate">{hoveredItem.item.name}</span>
                    <span 
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[hoveredItem.item.category] || '#0d9488' }}
                    >
                      {hoveredItem.item.category}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300">
                    Prevalence: <strong className="text-teal-400">{hoveredItem.item.count}×</strong> of {history.length} assessments ({hoveredItem.item.percentage}%)
                  </div>

                  <div className="text-[10px] text-slate-400">
                    Severity Weight: <span className="text-amber-300 font-semibold">{hoveredItem.item.severityWeight} / 5</span>
                  </div>

                  {hoveredItem.item.associatedDiseases.length > 0 && (
                    <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                      <span>Seen in: </span>
                      <span className="text-slate-200">{hoveredItem.item.associatedDiseases.slice(0, 2).join(', ')}</span>
                      {hoveredItem.item.associatedDiseases.length > 2 && (
                        <span> +{hoveredItem.item.associatedDiseases.length - 2} more</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Color Legend & Hint */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-semibold text-slate-600">Bodily Systems:</span>
              {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-slate-600">{cat}</span>
                </div>
              ))}
            </div>

            {onSelectSymptom && (
              <span className="text-[10px] text-slate-400 italic">
                Tip: Click any symptom bar to toggle it in your current diagnosis workspace.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
