'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  UK_SEMRUSH_KEYWORDS,
  UK_SERP_COMPETITORS,
  SemrushKeyword,
} from '../lib/semrushData';
import {
  Search,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Globe,
  FileSpreadsheet,
  FileText,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowUpDown,
  BookOpen,
  Filter,
  Eye,
  RefreshCw,
  Plus,
  BarChart3,
  SlidersHorizontal,
} from 'lucide-react';

export default function SeoDashboardPage() {
  const [activeTab, setActiveTab] = useState<'keywords' | 'audit' | 'competitors' | 'serp' | 'ai-studio'>('keywords');

  // Keyword list state with ability to add custom keywords
  const [keywords, setKeywords] = useState<SemrushKeyword[]>(UK_SEMRUSH_KEYWORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [intentFilter, setIntentFilter] = useState<string>('All');
  const [kdFilter, setKdFilter] = useState<'all' | 'easy' | 'moderate' | 'hard'>('all');
  const [sortBy, setSortBy] = useState<'volume' | 'kd' | 'priority' | 'cpc'>('priority');

  // AI Content Studio State
  const [aiTopic, setAiTopic] = useState('How to Calculate Concrete Blocks for a Wall UK');
  const [aiKeyword, setAiKeyword] = useState('concrete blocks');
  const [aiVolume, setAiVolume] = useState(14800);
  const [aiArticleType, setAiArticleType] = useState<'technical-guide' | 'how-to' | 'cost-comparison' | 'material-spec'>('technical-guide');
  const [aiBsGrade, setAiBsGrade] = useState('C20 / C25 (BS 8500)');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState<string>('');
  const [aiCopied, setAiCopied] = useState(false);

  // SERP Simulator State
  const [serpPage, setSerpPage] = useState<string>('home');
  const [serpTitle, setSerpTitle] = useState('Concrete Calculator UK – m³, Bags & Cost for Slabs, Bases & Footings');
  const [serpDesc, setSerpDesc] = useState('Calculate cubic metres, 25kg bags, wet weight, and estimated costs for slabs, bases, footings, post holes, and steps with UK mix guides and worked examples.');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Add keyword modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKeywordName, setNewKeywordName] = useState('');
  const [newKeywordVol, setNewKeywordVol] = useState(1000);
  const [newKeywordKd, setNewKeywordKd] = useState(15);
  const [newKeywordIntent, setNewKeywordIntent] = useState<'I' | 'C' | 'T'>('I');
  const [newKeywordUrl, setNewKeywordUrl] = useState('/');

  // Filtered & Sorted Keywords
  const filteredKeywords = useMemo(() => {
    return keywords
      .filter((k) => {
        if (searchQuery.trim() && !k.keyword.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        if (categoryFilter !== 'All' && k.category !== categoryFilter) {
          return false;
        }
        if (intentFilter !== 'All' && k.intent !== intentFilter) {
          return false;
        }
        if (kdFilter === 'easy' && k.kd > 20) return false;
        if (kdFilter === 'moderate' && (k.kd <= 20 || k.kd > 35)) return false;
        if (kdFilter === 'hard' && k.kd <= 35) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'volume') return b.volume - a.volume;
        if (sortBy === 'kd') return a.kd - b.kd;
        if (sortBy === 'priority') return b.priorityScore - a.priorityScore;
        if (sortBy === 'cpc') return b.cpc - a.cpc;
        return 0;
      });
  }, [keywords, searchQuery, categoryFilter, intentFilter, kdFilter, sortBy]);

  // Aggregate stats
  const totalVolume = useMemo(() => keywords.reduce((sum, k) => sum + k.volume, 0), [keywords]);
  const avgKd = useMemo(() => Math.round(keywords.reduce((sum, k) => sum + k.kd, 0) / keywords.length), [keywords]);
  const quickWinCount = useMemo(() => keywords.filter((k) => k.kd <= 20).length, [keywords]);

  // AI Content Generator handler
  const handleGenerateContent = async () => {
    setAiLoading(true);
    setAiGeneratedContent('');
    try {
      const res = await fetch('/api/seo/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          keyword: aiKeyword,
          targetVolume: aiVolume,
          articleType: aiArticleType,
          bsGrade: aiBsGrade,
        }),
      });
      const data = await res.json();
      if (data.success && data.content) {
        setAiGeneratedContent(data.content);
      } else {
        setAiGeneratedContent('# Error generating content. Please verify API parameters.');
      }
    } catch (e: any) {
      setAiGeneratedContent(`# Network error: ${e.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyAiContent = () => {
    navigator.clipboard.writeText(aiGeneratedContent);
    setAiCopied(true);
    setTimeout(() => setAiCopied(false), 2000);
  };

  const handleExportKeywordsCsv = () => {
    const rows = [
      ['Keyword', 'Volume (UK)', 'KD %', 'Intent', 'CPC (£)', 'Category', 'Target URL', 'Status', 'Priority'],
      ...keywords.map((k) => [
        `"${k.keyword}"`,
        k.volume,
        k.kd,
        k.intent,
        k.cpc.toFixed(2),
        k.category,
        k.targetUrl,
        k.status,
        k.priorityScore,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `semrush-uk-concrete-keywords.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordName.trim()) return;
    const newK: SemrushKeyword = {
      keyword: newKeywordName.toLowerCase().trim(),
      volume: newKeywordVol,
      kd: newKeywordKd,
      intent: newKeywordIntent,
      intentLabel: newKeywordIntent === 'I' ? 'Informational' : newKeywordIntent === 'C' ? 'Commercial' : 'Transactional',
      cpc: 0.65,
      competitiveDensity: 0.35,
      serpFeatures: ['People Also Ask', 'Featured Snippet'],
      category: 'Questions',
      targetUrl: newKeywordUrl,
      status: newKeywordKd <= 20 ? 'Quick Win' : 'Optimized',
      priorityScore: Math.min(99, Math.round(90 + (newKeywordVol / 1000) - (newKeywordKd / 2))),
    };
    setKeywords([newK, ...keywords]);
    setShowAddModal(false);
    setNewKeywordName('');
  };

  return (
    <div className="wrap">
      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: 'seo & organic growth platform' },
        ]}
      />

      {/* Header Banner */}
      <div className="hero" style={{ paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <TrendingUp size={16} aria-hidden="true" />
          <span>UK SEO Intelligence &amp; Organic Growth Command Centre</span>
        </div>
        <h1>UK Tool SEO Dashboard &amp; Content Platform</h1>
        <p className="lead">
          Manage your UK keyword clusters, monitor technical crawlability, benchmark against top UK ready-mix competitors (Cemex, Hanson, Travis Perkins), preview Google UK search snippets, and publish AI-assisted British Standard guides.
        </p>
      </div>

      {/* KPI Overview Tiles */}
      <div className="calc-volume-grid" style={{ marginBottom: '24px' }}>
        <div className="calc-volume-tile primary">
          <div className="calc-volume-val">{(totalVolume / 1000).toFixed(1)}k</div>
          <div className="calc-volume-sub">Total UK Search Volume</div>
          <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px' }}>
            Across {keywords.length} tracked high-intent Semrush keywords
          </div>
        </div>

        <div className="calc-volume-tile">
          <div className="calc-volume-val" style={{ color: 'var(--ok)' }}>{avgKd}%</div>
          <div className="calc-volume-sub">Average Keyword Difficulty</div>
          <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px' }}>
            {quickWinCount} &ldquo;Quick Win&rdquo; opportunities with KD &le; 20%
          </div>
        </div>

        <div className="calc-volume-tile">
          <div className="calc-volume-val">98 / 100</div>
          <div className="calc-volume-sub">Technical SEO Health</div>
          <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px' }}>
            Valid sitemap.xml, robots.txt &amp; FAQPage JSON-LD schemas
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="calc-nav-tabs" style={{ marginBottom: '20px' }}>
        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'keywords' ? 'active' : ''}`}
          onClick={() => setActiveTab('keywords')}
        >
          <BarChart3 size={15} style={{ marginRight: '6px' }} />
          Semrush Keyword Intelligence ({keywords.length})
        </button>

        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'ai-studio' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-studio')}
        >
          <Sparkles size={15} style={{ marginRight: '6px', color: '#eab308' }} />
          AI Content Publisher
        </button>

        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'serp' ? 'active' : ''}`}
          onClick={() => setActiveTab('serp')}
        >
          <Eye size={15} style={{ marginRight: '6px' }} />
          Google UK SERP Simulator
        </button>

        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'competitors' ? 'active' : ''}`}
          onClick={() => setActiveTab('competitors')}
        >
          <Globe size={15} style={{ marginRight: '6px' }} />
          UK Competitor Benchmarks
        </button>

        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <ShieldCheck size={15} style={{ marginRight: '6px' }} />
          Technical SEO &amp; Schema Audit
        </button>
      </div>

      {/* TAB 1: SEMRUSH KEYWORD INTELLIGENCE */}
      {activeTab === 'keywords' && (
        <section className="c" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Semrush UK Keyword Intelligence</h2>
              <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '13px' }}>
                Extracted directly from UK Semrush database (Concrete, Concrete Blocks, Postcrete, and Questions clusters).
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-action"
                style={{ minHeight: '38px', padding: '6px 12px', fontSize: '12.5px' }}
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={14} />
                <span>Add Keyword</span>
              </button>
              <button
                type="button"
                className="btn-action"
                style={{ minHeight: '38px', padding: '6px 12px', fontSize: '12.5px' }}
                onClick={handleExportKeywordsCsv}
              >
                <FileSpreadsheet size={14} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Filtering Bar */}
          <div
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              padding: '12px 14px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            {/* Search Box */}
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--muted)' }} />
              <input
                type="text"
                placeholder="Search keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 32px',
                  borderRadius: '6px',
                  border: '1px solid var(--line-strong)',
                  background: 'var(--surface)',
                  fontSize: '13.5px',
                  color: 'var(--ink)',
                }}
              />
            </div>

            {/* Category Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="calc-select"
                style={{ minHeight: '36px', padding: '4px 8px', fontSize: '13px' }}
              >
                <option value="All">All Categories</option>
                <option value="Block">Concrete Blocks</option>
                <option value="Volume & Bags">Volume &amp; Bags</option>
                <option value="Postcrete & Posts">Postcrete &amp; Posts</option>
                <option value="Cost & Specs">Cost &amp; Specs</option>
                <option value="Questions">Questions / How-Tos</option>
              </select>
            </div>

            {/* KD Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>KD Filter:</span>
              <select
                value={kdFilter}
                onChange={(e) => setKdFilter(e.target.value as any)}
                className="calc-select"
                style={{ minHeight: '36px', padding: '4px 8px', fontSize: '13px' }}
              >
                <option value="all">All Difficulty</option>
                <option value="easy">Easy / Quick Wins (KD &le; 20%)</option>
                <option value="moderate">Moderate (21% &ndash; 35%)</option>
                <option value="hard">Hard (36%+)</option>
              </select>
            </div>

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="calc-select"
                style={{ minHeight: '36px', padding: '4px 8px', fontSize: '13px' }}
              >
                <option value="priority">Priority Score</option>
                <option value="volume">Search Volume (High &rarr; Low)</option>
                <option value="kd">KD % (Lowest First)</option>
                <option value="cpc">CPC (£)</option>
              </select>
            </div>
          </div>

          {/* Keywords Table */}
          <div className="scroll">
            <table style={{ minWidth: '780px' }}>
              <thead>
                <tr>
                  <th>Keyword</th>
                  <th>UK Volume</th>
                  <th>KD %</th>
                  <th>Intent</th>
                  <th>CPC (£)</th>
                  <th>Target URL</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeywords.map((k) => (
                  <tr key={k.keyword}>
                    <td>
                      <strong>{k.keyword}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', display: 'flex', gap: '6px', marginTop: '2px' }}>
                        <span>{k.category}</span>
                        <span>&middot;</span>
                        <span>Score: {k.priorityScore}/100</span>
                      </div>
                    </td>
                    <td><strong>{k.volume.toLocaleString()}</strong></td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          background:
                            k.kd <= 20
                              ? 'rgba(16, 185, 129, 0.15)'
                              : k.kd <= 35
                              ? 'rgba(234, 179, 8, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                          color:
                            k.kd <= 20
                              ? '#059669'
                              : k.kd <= 35
                              ? '#b45309'
                              : '#dc2626',
                        }}
                      >
                        {k.kd}%
                      </span>
                    </td>
                    <td>
                      <span
                        title={k.intentLabel}
                        style={{
                          display: 'inline-block',
                          width: '24px',
                          height: '24px',
                          lineHeight: '24px',
                          textAlign: 'center',
                          borderRadius: '50%',
                          fontSize: '11px',
                          fontWeight: 800,
                          background: k.intent === 'I' ? '#e0f2fe' : k.intent === 'C' ? '#fef3c7' : '#dcfce7',
                          color: k.intent === 'I' ? '#0369a1' : k.intent === 'C' ? '#b45309' : '#15803d',
                        }}
                      >
                        {k.intent}
                      </span>
                    </td>
                    <td>£{k.cpc.toFixed(2)}</td>
                    <td>
                      <Link
                        href={k.targetUrl}
                        style={{ fontSize: '12.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        {k.targetUrl} <ExternalLink size={11} />
                      </Link>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background:
                            k.status === 'Live & Ranked'
                              ? 'var(--accent-subtle)'
                              : k.status === 'Quick Win'
                              ? 'var(--ok-bg)'
                              : 'var(--surface-elevated)',
                          color:
                            k.status === 'Live & Ranked'
                              ? 'var(--calc-blue)'
                              : k.status === 'Quick Win'
                              ? 'var(--ok)'
                              : 'var(--ink)',
                        }}
                      >
                        {k.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-action"
                        style={{ minHeight: '30px', padding: '4px 8px', fontSize: '11.5px' }}
                        onClick={() => {
                          setAiTopic(`Complete UK Guide to ${k.keyword}`);
                          setAiKeyword(k.keyword);
                          setAiVolume(k.volume);
                          setActiveTab('ai-studio');
                        }}
                      >
                        <Sparkles size={12} color="#eab308" />
                        <span>Draft Article</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 2: AI CONTENT PUBLISHER */}
      {activeTab === 'ai-studio' && (
        <section className="c" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Sparkles size={16} aria-hidden="true" color="#eab308" />
            <span>Server-Side Gemini API Content Studio</span>
          </div>
          <h2 style={{ marginTop: 0 }}>AI-Assisted UK Builder Guide Publisher</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>
            Generate in-depth technical construction guides conforming to British Standards (BS 8500 / BS EN 206) and UK Building Regulations. Includes live markdown preview and copy/export functionality.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', background: 'var(--surface-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)', margin: '20px 0' }}>
            <div className="f" style={{ margin: 0 }}>
              <label>Target Keyword:</label>
              <input
                type="text"
                value={aiKeyword}
                onChange={(e) => setAiKeyword(e.target.value)}
                placeholder="e.g. concrete blocks"
              />
            </div>

            <div className="f" style={{ margin: 0 }}>
              <label>Article Topic / Headline:</label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g. How to Calculate Concrete Blocks for a Wall"
              />
            </div>

            <div className="f" style={{ margin: 0 }}>
              <label>Format &amp; Content Type:</label>
              <select
                value={aiArticleType}
                onChange={(e) => setAiArticleType(e.target.value as any)}
              >
                <option value="technical-guide">Technical Trade Guide with Worked Math</option>
                <option value="how-to">DIY Step-by-Step Practical How-To</option>
                <option value="cost-comparison">UK Cost &amp; Material Comparison</option>
                <option value="material-spec">British Standard Specification (BS 8500)</option>
              </select>
            </div>

            <div className="f" style={{ margin: 0 }}>
              <label>Concrete / Mortar Mix Grade:</label>
              <select
                value={aiBsGrade}
                onChange={(e) => setAiBsGrade(e.target.value)}
              >
                <option value="C20 / C25 (BS 8500)">C20 / C25 — Standard Domestic (Shed bases, footings)</option>
                <option value="C25 / C30 (BS 8500)">C25 / C30 — High Strength (Driveways, garage slabs)</option>
                <option value="Class M4 (1:4 Cement:Sand)">Class M4 (1:4 Cement:Sand) — Standard Masonry Mortar</option>
                <option value="Class M6 (1:3 Cement:Sand)">Class M6 (1:3 Cement:Sand) — Retaining / Below DPC Mortar</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
            <button
              type="button"
              className="calc-btn-calc"
              onClick={handleGenerateContent}
              disabled={aiLoading}
              style={{ minHeight: '44px', padding: '10px 24px', opacity: aiLoading ? 0.7 : 1 }}
            >
              {aiLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Generating UK Guide with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Article with Gemini API</span>
                </>
              )}
            </button>

            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
              Uses model: <code>gemini-2.5-flash</code> with UK trade prompt engineering
            </span>
          </div>

          {/* Output Display */}
          {aiGeneratedContent && (
            <div style={{ border: '1px solid var(--line)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ background: 'var(--surface-elevated)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--calc-blue)' }}>
                  Generated Draft (Ready for Publication)
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-action"
                    style={{ minHeight: '34px', padding: '4px 10px', fontSize: '12px' }}
                    onClick={handleCopyAiContent}
                  >
                    {aiCopied ? <Check size={13} color="var(--ok)" /> : <Copy size={13} />}
                    <span>{aiCopied ? 'Copied!' : 'Copy Markdown'}</span>
                  </button>
                </div>
              </div>

              <div
                style={{
                  padding: '24px',
                  background: 'var(--surface)',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  lineHeight: '1.65',
                  maxHeight: '500px',
                  overflowY: 'auto',
                }}
              >
                {aiGeneratedContent}
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: GOOGLE UK SERP SIMULATOR */}
      {activeTab === 'serp' && (
        <section className="c" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Eye size={16} aria-hidden="true" />
            <span>Google UK Rich Search Snippet Simulator</span>
          </div>
          <h2 style={{ marginTop: 0 }}>Google.co.uk SERP Snippet Preview</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>
            Test and optimize page title tags and meta descriptions in real-time. Check character boundaries (title &le; 60 chars, meta &le; 155 chars) and preview rich snippet enhancements.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0' }}>
            {/* Editor Inputs */}
            <div>
              <div className="f">
                <label>Select Preset Page:</label>
                <select
                  value={serpPage}
                  onChange={(e) => {
                    const p = e.target.value;
                    setSerpPage(p);
                    if (p === 'home') {
                      setSerpTitle('Concrete Calculator UK – m³, Bags & Cost for Slabs, Bases & Footings');
                      setSerpDesc('Calculate cubic metres, 25kg bags, wet weight, and estimated costs for slabs, bases, footings, post holes, and steps with UK mix guides and worked examples.');
                    } else if (p === 'block') {
                      setSerpTitle('Concrete Block Calculator UK – 440x215mm Blocks, Mortar & Sand');
                      setSerpDesc('Calculate concrete blocks per m² (10 blocks/m² rule), building sand bags, cement, and costs for UK single skin and cavity walls (BS EN 771-3).');
                    } else if (p === 'postcrete') {
                      setSerpTitle('Postcrete Calculator UK – Fence Post Concrete Bags & Hole Depth');
                      setSerpDesc('Calculate 20kg rapid-set Postcrete bags needed per fence post hole. Includes UK one-third depth rules and alternative 1:5 ballast mix comparisons.');
                    } else if (p === 'shed') {
                      setSerpTitle('Concrete Shed Base: How Much Concrete Do You Need? (6x4 & 8x6)');
                      setSerpDesc('Exact volume math and 25kg bag estimates for standard 6x4 and 8x6 garden shed bases. Includes 100mm slab thickness and MOT Type 1 sub-base guide.');
                    }
                  }}
                >
                  <option value="home">Home Calculator (/)</option>
                  <option value="block">Concrete Block Calculator (/concrete-block-calculator)</option>
                  <option value="postcrete">Postcrete Calculator (/postcrete-calculator)</option>
                  <option value="shed">Shed Base Guide (/concrete-shed-base-how-much-do-i-need)</option>
                </select>
              </div>

              <div className="f">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>SEO Title Tag:</label>
                  <span style={{ fontSize: '12px', color: serpTitle.length > 60 ? '#dc2626' : 'var(--ok)' }}>
                    {serpTitle.length} / 60 chars {serpTitle.length > 60 ? '(May truncate)' : '(Optimal)'}
                  </span>
                </div>
                <input
                  type="text"
                  value={serpTitle}
                  onChange={(e) => setSerpTitle(e.target.value)}
                />
              </div>

              <div className="f">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>Meta Description:</label>
                  <span style={{ fontSize: '12px', color: serpDesc.length > 160 ? '#dc2626' : 'var(--ok)' }}>
                    {serpDesc.length} / 155 chars {serpDesc.length > 160 ? '(May truncate)' : '(Optimal)'}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={serpDesc}
                  onChange={(e) => setSerpDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className={`btn-action ${serpDevice === 'desktop' ? 'active' : ''}`}
                  onClick={() => setSerpDevice('desktop')}
                >
                  Desktop SERP
                </button>
                <button
                  type="button"
                  className={`btn-action ${serpDevice === 'mobile' ? 'active' : ''}`}
                  onClick={() => setSerpDevice('mobile')}
                >
                  Mobile SERP
                </button>
              </div>
            </div>

            {/* Google SERP Card Preview */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
                Google UK Simulation ({serpDevice.toUpperCase()})
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #dadce0',
                  borderRadius: serpDevice === 'mobile' ? '12px' : '8px',
                  padding: serpDevice === 'mobile' ? '14px 16px' : '16px 20px',
                  maxWidth: serpDevice === 'mobile' ? '360px' : '600px',
                  fontFamily: 'arial, sans-serif',
                }}
              >
                {/* Domain & Favicon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                    🧱
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#202124', lineHeight: 1.2 }}>ConcreteCalc.UK</div>
                    <div style={{ fontSize: '11px', color: '#4d5156', lineHeight: 1.2 }}>
                      https://concretecalc.uk {serpPage !== 'home' ? `› ${serpPage}` : ''}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3
                  style={{
                    color: '#1a0dab',
                    fontSize: serpDevice === 'mobile' ? '17px' : '19px',
                    lineHeight: '1.25',
                    fontWeight: 400,
                    margin: '6px 0 4px',
                    cursor: 'pointer',
                  }}
                >
                  {serpTitle}
                </h3>

                {/* Description */}
                <p style={{ color: '#4d5156', fontSize: '13px', lineHeight: '1.45', margin: '0 0 8px' }}>
                  {serpDesc}
                </p>

                {/* FAQ Rich Snippet Accordion Preview */}
                <div style={{ borderTop: '1px solid #ebebeb', paddingTop: '8px', marginTop: '6px' }}>
                  <div style={{ fontSize: '12px', color: '#1a0dab', display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span>How do I calculate cubic metres of concrete?</span>
                    <span>▾</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#1a0dab', display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span>How many 25kg bags make 1m³?</span>
                    <span>▾</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: UK COMPETITOR BENCHMARK */}
      {activeTab === 'competitors' && (
        <section className="c" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Globe size={16} aria-hidden="true" />
            <span>UK SERP Competitor Benchmarking</span>
          </div>
          <h2 style={{ marginTop: 0 }}>Top 5 UK Competitor Gap Analysis</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>
            Direct architectural and feature comparison with the top 5 ranking domains in Google UK for &ldquo;concrete calculator&rdquo;.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '20px 0' }}>
            {UK_SERP_COMPETITORS.map((c) => (
              <div
                key={c.domain}
                style={{
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '16px 20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--calc-blue)', marginRight: '8px' }}>
                      RANK #{c.rank}
                    </span>
                    <strong style={{ fontSize: '15px' }}>{c.title}</strong>
                    <span style={{ fontSize: '12.5px', color: 'var(--muted)', marginLeft: '8px' }}>({c.domain})</span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', fontSize: '12.5px' }}>
                    <span>Authority Score: <strong>{c.authorityScore}</strong></span>
                    <span>Est. Traffic: <strong>{c.estimatedTraffic}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#dc2626', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Competitor Weaknesses (Our Attack Opportunity):
                    </span>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--ink-secondary)' }}>
                      {c.weaknesses.map((w, idx) => (
                        <li key={idx} style={{ marginBottom: '3px' }}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span style={{ color: 'var(--ok)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Our Platform Advantage:
                    </span>
                    <p style={{ margin: 0, color: 'var(--ink-secondary)', lineHeight: '1.45' }}>
                      Zero lead gates, instant 25kg &amp; 20kg bag outputs, dedicated Block &amp; Postcrete calculators, exportable PDF/CSV quotes, and full BS 8500 domestic standard coverage.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 5: TECHNICAL SEO AUDIT */}
      {activeTab === 'audit' && (
        <section className="c" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Technical SEO Audit &amp; Schema Inspector</span>
          </div>
          <h2 style={{ marginTop: 0 }}>On-Page &amp; Server-Side Technical Checklist</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>
            Live verification of Googlebot crawl directives, canonical links, indexation rules, and Schema.org rich results.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', margin: '20px 0' }}>
            <div style={{ background: 'var(--surface-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Check size={16} color="var(--ok)" />
                <strong style={{ fontSize: '14px' }}>Dynamic XML Sitemap</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>
                Served dynamically via <code>/sitemap.xml</code> with lastModified timestamps and priority scores for all 12 key UK URLs.
              </p>
            </div>

            <div style={{ background: 'var(--surface-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Check size={16} color="var(--ok)" />
                <strong style={{ fontSize: '14px' }}>Robots.txt Directives</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>
                Configured at <code>/robots.txt</code> allowing full access to search crawlers with sitemap declaration.
              </p>
            </div>

            <div style={{ background: 'var(--surface-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Check size={16} color="var(--ok)" />
                <strong style={{ fontSize: '14px' }}>Schema.org FAQPage JSON-LD</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>
                Fully compliant multi-question JSON-LD embedded in layout.tsx targeting Google FAQ rich results.
              </p>
            </div>

            <div style={{ background: 'var(--surface-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Check size={16} color="var(--ok)" />
                <strong style={{ fontSize: '14px' }}>WebApplication Structured Data</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>
                SoftwareApplication metadata declared with £0 GBP price currency and British English inLanguage (&ldquo;en-GB&rdquo;).
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Add Keyword Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: '12px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', color: 'var(--calc-blue)' }}>
              Add Tracked UK Keyword
            </h3>

            <form onSubmit={handleAddKeyword}>
              <div className="f">
                <label>Keyword Term:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. concrete lego blocks"
                  value={newKeywordName}
                  onChange={(e) => setNewKeywordName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="f">
                  <label>UK Monthly Volume:</label>
                  <input
                    type="number"
                    value={newKeywordVol}
                    onChange={(e) => setNewKeywordVol(parseInt(e.target.value, 10) || 0)}
                  />
                </div>

                <div className="f">
                  <label>KD % (0–100):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newKeywordKd}
                    onChange={(e) => setNewKeywordKd(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="f">
                  <label>Intent:</label>
                  <select
                    value={newKeywordIntent}
                    onChange={(e) => setNewKeywordIntent(e.target.value as any)}
                  >
                    <option value="I">Informational (I)</option>
                    <option value="C">Commercial (C)</option>
                    <option value="T">Transactional (T)</option>
                  </select>
                </div>

                <div className="f">
                  <label>Target Page URL:</label>
                  <input
                    type="text"
                    value={newKeywordUrl}
                    onChange={(e) => setNewKeywordUrl(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-action"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="calc-btn-calc"
                  style={{ minHeight: '38px', padding: '6px 16px' }}
                >
                  Save Keyword
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
