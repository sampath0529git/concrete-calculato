'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  UK_SEMRUSH_KEYWORDS,
  UK_SERP_COMPETITORS,
  UK_TOPIC_CLUSTERS,
  UK_OUTREACH_PLAYBOOKS,
  PAGE_AUDIT_PROFILES,
  SemrushKeyword,
  TopicCluster,
  OutreachPlaybook,
  PageAuditProfile,
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
  Network,
  Send,
  Download,
  Code,
  Gauge,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

export default function SeoDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    'keywords' | 'ai-studio' | 'page-grader' | 'clusters' | 'outreach' | 'serp' | 'audit'
  >('keywords');

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
  const [aiArticleType, setAiArticleType] = useState<
    'technical-guide' | 'how-to' | 'cost-comparison' | 'material-spec'
  >('technical-guide');
  const [aiBsGrade, setAiBsGrade] = useState('C20 / C25 (BS 8500)');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState<string>('');
  const [aiPreviewMode, setAiPreviewMode] = useState<'preview' | 'raw'>('preview');
  const [aiCopied, setAiCopied] = useState(false);
  const [aiCopiedHtml, setAiCopiedHtml] = useState(false);

  // Live Page SEO Grader State
  const [selectedAuditPageUrl, setSelectedAuditPageUrl] = useState<string>('/');
  const activeAuditProfile = useMemo(
    () => PAGE_AUDIT_PROFILES.find((p) => p.pageUrl === selectedAuditPageUrl) || PAGE_AUDIT_PROFILES[0],
    [selectedAuditPageUrl]
  );

  // Outreach playbook state
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);

  // Topic cluster state
  const [selectedClusterId, setSelectedClusterId] = useState<string>('core-concrete');
  const activeCluster = useMemo(
    () => UK_TOPIC_CLUSTERS.find((c) => c.id === selectedClusterId) || UK_TOPIC_CLUSTERS[0],
    [selectedClusterId]
  );

  // SERP Simulator State
  const [serpPage, setSerpPage] = useState<string>('home');
  const [serpTitle, setSerpTitle] = useState(
    'Concrete Calculator UK – m³, Bags & Cost for Slabs, Bases & Footings'
  );
  const [serpDesc, setSerpDesc] = useState(
    'Calculate cubic metres, 25kg bags, wet weight, and estimated costs for slabs, bases, footings, post holes, and steps with UK mix guides and worked examples.'
  );
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showFaqRichSnippet, setShowFaqRichSnippet] = useState(true);

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
  const avgKd = useMemo(
    () => Math.round(keywords.reduce((sum, k) => sum + k.kd, 0) / keywords.length),
    [keywords]
  );
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

  const handleDownloadMarkdown = () => {
    if (!aiGeneratedContent) return;
    const blob = new Blob([aiGeneratedContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${aiKeyword.replace(/\s+/g, '-').toLowerCase()}-uk-guide.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyPitch = (pitch: string, id: string) => {
    navigator.clipboard.writeText(pitch);
    setCopiedPitchId(id);
    setTimeout(() => setCopiedPitchId(null), 2000);
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
      intentLabel:
        newKeywordIntent === 'I'
          ? 'Informational'
          : newKeywordIntent === 'C'
          ? 'Commercial'
          : 'Transactional',
      cpc: 0.65,
      competitiveDensity: 0.35,
      serpFeatures: ['People Also Ask', 'Featured Snippet'],
      category: 'Questions',
      targetUrl: newKeywordUrl,
      status: newKeywordKd <= 20 ? 'Quick Win' : 'Optimized',
      priorityScore: Math.min(99, Math.round(90 + newKeywordVol / 1000 - newKeywordKd / 2)),
    };
    setKeywords([newK, ...keywords]);
    setShowAddModal(false);
    setNewKeywordName('');
  };

  // Word count and read time calculations for AI content
  const wordCount = useMemo(() => {
    if (!aiGeneratedContent) return 0;
    return aiGeneratedContent.trim().split(/\s+/).length;
  }, [aiGeneratedContent]);

  const readTimeMin = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--calc-blue)',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <TrendingUp size={16} aria-hidden="true" />
          <span>UK SEO Intelligence &amp; Organic Growth Command Centre</span>
        </div>
        <h1>UK Tool SEO Dashboard &amp; Content Platform</h1>
        <p className="lead">
          Manage your UK keyword clusters, monitor on-page SEO scores, benchmark against top UK ready-mix competitors (Cemex, Hanson, Travis Perkins), orchestrate UK trade backlink outreach, and publish AI-assisted British Standard guides.
        </p>
      </div>

      {/* KPI Overview Tiles */}
      <div className="calc-volume-grid" style={{ marginBottom: '24px' }}>
        <div className="calc-volume-tile primary">
          <div className="calc-volume-val">{(totalVolume / 1000).toFixed(1)}k</div>
          <div className="calc-volume-sub">Tracked UK Search Volume</div>
          <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px' }}>
            Across {keywords.length} high-intent Semrush keywords
          </div>
        </div>

        <div className="calc-volume-tile">
          <div className="calc-volume-val" style={{ color: 'var(--ok)' }}>
            {avgKd}%
          </div>
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

      {/* Tab Navigation across all 7 growth modules */}
      <div className="calc-nav-tabs" style={{ marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'keywords' ? 'active' : ''}`}
          onClick={() => setActiveTab('keywords')}
        >
          <BarChart3 size={15} style={{ marginRight: '6px' }} />
          Semrush Keywords ({keywords.length})
        </button>

        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'ai-studio' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-studio')}
        >
          <Sparkles size={15} style={{ marginRight: '6px', color: '#eab308' }} />
          AI Content Studio
        </button>

        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'page-grader' ? 'active' : ''}`}
          onClick={() => setActiveTab('page-grader')}
        >
          <Gauge size={15} style={{ marginRight: '6px', color: 'var(--ok)' }} />
          Live Page SEO Grader
        </button>

        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'clusters' ? 'active' : ''}`}
          onClick={() => setActiveTab('clusters')}
        >
          <Network size={15} style={{ marginRight: '6px' }} />
          Topic Clusters &amp; Links
        </button>

        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'outreach' ? 'active' : ''}`}
          onClick={() => setActiveTab('outreach')}
        >
          <Send size={15} style={{ marginRight: '6px' }} />
          UK Backlink Playbook
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
          className={`calc-nav-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <ShieldCheck size={15} style={{ marginRight: '6px' }} />
          Technical Audit &amp; Competitors
        </button>
      </div>

      {/* TAB 1: SEMRUSH KEYWORD INTELLIGENCE */}
      {activeTab === 'keywords' && (
        <section className="c" style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
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
              <Search
                size={15}
                style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--muted)' }}
              />
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
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>
                Category:
              </span>
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
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>
                KD Filter:
              </span>
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
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>
                Sort by:
              </span>
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
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--muted)',
                          display: 'flex',
                          gap: '6px',
                          marginTop: '2px',
                        }}
                      >
                        <span>{k.category}</span>
                        <span>&middot;</span>
                        <span>Score: {k.priorityScore}/100</span>
                      </div>
                    </td>
                    <td>
                      <strong>{k.volume.toLocaleString()}</strong>
                    </td>
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
                          background:
                            k.intent === 'I'
                              ? '#e0f2fe'
                              : k.intent === 'C'
                              ? '#fef3c7'
                              : '#dcfce7',
                          color:
                            k.intent === 'I'
                              ? '#0369a1'
                              : k.intent === 'C'
                              ? '#b45309'
                              : '#15803d',
                        }}
                      >
                        {k.intent}
                      </span>
                    </td>
                    <td>£{k.cpc.toFixed(2)}</td>
                    <td>
                      <Link
                        href={k.targetUrl}
                        style={{
                          fontSize: '12.5px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
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

      {/* TAB 2: AI CONTENT STUDIO */}
      {activeTab === 'ai-studio' && (
        <section className="c" style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--calc-blue)',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <Sparkles size={16} aria-hidden="true" color="#eab308" />
            <span>Server-Side Gemini API Content Studio</span>
          </div>
          <h2 style={{ marginTop: 0 }}>AI-Assisted UK Builder Guide Publisher</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>
            Generate in-depth technical construction guides conforming to British Standards (BS 8500 / BS EN 206) and UK Building Regulations. Includes live markdown preview, HTML export, and ready-to-paste Schema.org JSON-LD markup.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              background: 'var(--surface-elevated)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              margin: '20px 0',
            }}
          >
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
              <select value={aiBsGrade} onChange={(e) => setAiBsGrade(e.target.value)}>
                <option value="C20 / C25 (BS 8500)">
                  C20 / C25 — Standard Domestic (Shed bases, footings)
                </option>
                <option value="C25 / C30 (BS 8500)">
                  C25 / C30 — High Strength (Driveways, garage slabs)
                </option>
                <option value="Class M4 (1:4 Cement:Sand)">
                  Class M4 (1:4 Cement:Sand) — Standard Masonry Mortar
                </option>
                <option value="Class M6 (1:3 Cement:Sand)">
                  Class M6 (1:3 Cement:Sand) — Retaining / Below DPC Mortar
                </option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '24px',
            }}
          >
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
              <div
                style={{
                  background: 'var(--surface-elevated)',
                  padding: '10px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--calc-blue)' }}>
                    Generated Content
                  </span>
                  <span
                    style={{
                      fontSize: '11.5px',
                      background: 'var(--accent-subtle)',
                      color: 'var(--accent)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}
                  >
                    {wordCount} words &middot; ~{readTimeMin} min read
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* Mode toggle */}
                  <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: '6px', border: '1px solid var(--line)', padding: '2px' }}>
                    <button
                      type="button"
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        border: 'none',
                        borderRadius: '4px',
                        background: aiPreviewMode === 'preview' ? 'var(--calc-blue)' : 'transparent',
                        color: aiPreviewMode === 'preview' ? '#fff' : 'var(--muted)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                      onClick={() => setAiPreviewMode('preview')}
                    >
                      Formatted Preview
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        border: 'none',
                        borderRadius: '4px',
                        background: aiPreviewMode === 'raw' ? 'var(--calc-blue)' : 'transparent',
                        color: aiPreviewMode === 'raw' ? '#fff' : 'var(--muted)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                      onClick={() => setAiPreviewMode('raw')}
                    >
                      Raw Markdown
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn-action"
                    style={{ minHeight: '34px', padding: '4px 10px', fontSize: '12px' }}
                    onClick={handleCopyAiContent}
                    title="Copy Raw Markdown"
                  >
                    {aiCopied ? <Check size={13} color="var(--ok)" /> : <Copy size={13} />}
                    <span>{aiCopied ? 'Copied MD!' : 'Copy Markdown'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn-action"
                    style={{ minHeight: '34px', padding: '4px 10px', fontSize: '12px' }}
                    onClick={handleDownloadMarkdown}
                    title="Download as .md file"
                  >
                    <Download size={13} />
                    <span>Download .md</span>
                  </button>
                </div>
              </div>

              {aiPreviewMode === 'preview' ? (
                <div
                  style={{
                    padding: '24px',
                    background: 'var(--surface)',
                    fontSize: '14.5px',
                    lineHeight: '1.7',
                    maxHeight: '520px',
                    overflowY: 'auto',
                  }}
                >
                  {aiGeneratedContent.split('\n\n').map((block, i) => {
                    if (block.startsWith('# ')) {
                      return (
                        <h1 key={i} style={{ fontSize: '1.6rem', color: 'var(--calc-blue)', marginTop: i === 0 ? 0 : '16px' }}>
                          {block.replace('# ', '')}
                        </h1>
                      );
                    }
                    if (block.startsWith('## ')) {
                      return (
                        <h2 key={i} style={{ fontSize: '1.3rem', marginTop: '20px', marginBottom: '8px', borderBottom: '1px solid var(--line)', paddingBottom: '4px' }}>
                          {block.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (block.startsWith('### ')) {
                      return (
                        <h3 key={i} style={{ fontSize: '1.1rem', marginTop: '14px', marginBottom: '6px' }}>
                          {block.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (block.startsWith('> ')) {
                      return (
                        <blockquote
                          key={i}
                          style={{
                            margin: '12px 0',
                            padding: '12px 16px',
                            background: 'var(--accent-subtle)',
                            borderLeft: '4px solid var(--accent)',
                            borderRadius: '4px',
                            color: 'var(--ink)',
                          }}
                        >
                          {block.replace('> ', '')}
                        </blockquote>
                      );
                    }
                    return (
                      <p key={i} style={{ margin: '8px 0', color: 'var(--ink)' }}>
                        {block}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  readOnly
                  value={aiGeneratedContent}
                  style={{
                    width: '100%',
                    height: '400px',
                    padding: '20px',
                    background: 'var(--surface)',
                    border: 'none',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: 'var(--ink)',
                    resize: 'vertical',
                  }}
                />
              )}

              {/* Ready-to-paste Meta & Schema Box */}
              <div style={{ background: 'var(--surface-elevated)', borderTop: '1px solid var(--line)', padding: '16px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                  Target Metadata &amp; Schema Code (Copy to Page Header):
                </div>
                <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: '6px', border: '1px solid var(--line)', fontFamily: 'monospace', fontSize: '11.5px', color: 'var(--ink-secondary)' }}>
                  {`<title>${aiKeyword.charAt(0).toUpperCase() + aiKeyword.slice(1)} UK Guide & Calculations – ConcreteCalc.UK</title>\n<meta name="description" content="Complete British standard specification and worked calculation examples for ${aiKeyword}. Conforms to BS 8500 and UK building standards." />`}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: LIVE PAGE SEO GRADER */}
      {activeTab === 'page-grader' && (
        <section className="c" style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--calc-blue)',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <Gauge size={16} aria-hidden="true" color="var(--ok)" />
            <span>Interactive On-Page Content &amp; Meta Health Inspector</span>
          </div>
          <h2 style={{ marginTop: 0 }}>Live Page SEO Grader &amp; Optimization Audit</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>
            Inspect on-page keyword density, character limits, UK spelling compliance (metres, tonnes, labour), internal anchor coverage, and Schema.org rich markup across key application routes.
          </p>

          {/* Page Selector Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '18px 0 24px' }}>
            {PAGE_AUDIT_PROFILES.map((p) => (
              <button
                key={p.pageUrl}
                type="button"
                className={`calc-preset-tag ${selectedAuditPageUrl === p.pageUrl ? 'active' : ''}`}
                style={{
                  background: selectedAuditPageUrl === p.pageUrl ? 'var(--calc-blue)' : undefined,
                  color: selectedAuditPageUrl === p.pageUrl ? '#fff' : undefined,
                  borderColor: selectedAuditPageUrl === p.pageUrl ? 'var(--calc-blue)' : undefined,
                }}
                onClick={() => setSelectedAuditPageUrl(p.pageUrl)}
              >
                {p.name} ({p.score}/100)
              </button>
            ))}
          </div>

          {/* Audit Card */}
          <div
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--line)',
              borderRadius: '10px',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                borderBottom: '1px solid var(--line)',
                paddingBottom: '16px',
                marginBottom: '20px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: 'var(--calc-blue)',
                    letterSpacing: '0.05em',
                  }}
                >
                  URL AUDIT FOR: {activeAuditProfile.pageUrl}
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '1.3rem' }}>{activeAuditProfile.name}</h3>
                <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '4px' }}>
                  Target Keyword: <strong>&ldquo;{activeAuditProfile.primaryKeyword}&rdquo;</strong> &middot;{' '}
                  {activeAuditProfile.targetVolume.toLocaleString()} monthly UK searches
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ok)' }}>
                    {activeAuditProfile.score}
                    <span style={{ fontSize: '1rem', color: 'var(--muted)' }}> / 100</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 600 }}>
                    Grade: {activeAuditProfile.status} (Production Ready)
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Checklist Items */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {/* Title Tag Check */}
              <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <CheckCircle2 size={16} color="var(--ok)" />
                  <strong style={{ fontSize: '13.5px' }}>Title Tag Optimization</strong>
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '12.5px', color: 'var(--ink)' }}>
                  &ldquo;{activeAuditProfile.currentTitle}&rdquo;
                </p>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                  Length: <strong>{activeAuditProfile.currentTitle.length} chars</strong> (Within optimal 30–60 range)
                </div>
              </div>

              {/* Meta Description Check */}
              <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <CheckCircle2 size={16} color="var(--ok)" />
                  <strong style={{ fontSize: '13.5px' }}>Meta Description &amp; CTR</strong>
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '12.5px', color: 'var(--ink)' }}>
                  &ldquo;{activeAuditProfile.currentDescription}&rdquo;
                </p>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                  Length: <strong>{activeAuditProfile.currentDescription.length} chars</strong> (Within 120–160 boundary)
                </div>
              </div>

              {/* Schema Markup Check */}
              <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <CheckCircle2 size={16} color="var(--ok)" />
                  <strong style={{ fontSize: '13.5px' }}>Schema.org Structured Data</strong>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '4px 0 6px' }}>
                  {activeAuditProfile.schemaTypes.map((st) => (
                    <span
                      key={st}
                      style={{
                        background: 'var(--accent-subtle)',
                        color: 'var(--accent)',
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 700,
                      }}
                    >
                      {st}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                  Valid JSON-LD markup configured for Google rich cards.
                </div>
              </div>

              {/* British English & Word Count Check */}
              <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <CheckCircle2 size={16} color="var(--ok)" />
                  <strong style={{ fontSize: '13.5px' }}>British Standards &amp; Lexicon</strong>
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '12.5px', color: 'var(--ink)' }}>
                  Word count: <strong>~{activeAuditProfile.wordCount} words</strong> &middot; Strictly verified for British English spelling (metres, tonnes, labour, formwork).
                </p>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                  Zero US misnomers (&ldquo;yards only&rdquo;, &ldquo;rebar pounds&rdquo;).
                </div>
              </div>
            </div>

            {/* Strengths and Growth Opportunities */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ok)', display: 'block', marginBottom: '8px' }}>
                  ✓ Core Architectural Strengths:
                </span>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: 'var(--ink-secondary)', lineHeight: '1.6' }}>
                  {activeAuditProfile.keyStrengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', display: 'block', marginBottom: '8px' }}>
                  ⚡ High-Impact Optimization Action:
                </span>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: 'var(--ink-secondary)', lineHeight: '1.6' }}>
                  {activeAuditProfile.suggestedImprovements.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: TOPIC CLUSTERS & INTERNAL LINKING */}
      {activeTab === 'clusters' && (
        <section className="c" style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--calc-blue)',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <Network size={16} aria-hidden="true" />
            <span>Topical Authority Architecture</span>
          </div>
          <h2 style={{ marginTop: 0 }}>Topic Clusters &amp; Internal Link Matrix</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>
            Hub-and-spoke internal linking structure designed to pass PageRank from the high-authority home calculator down to targeted transactional long-tail pages (BS EN 771-3 blocks, Postcrete, shed bases).
          </p>

          {/* Cluster Selection Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '18px 0 20px' }}>
            {UK_TOPIC_CLUSTERS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`calc-preset-tag ${selectedClusterId === c.id ? 'active' : ''}`}
                style={{
                  background: selectedClusterId === c.id ? 'var(--calc-blue)' : undefined,
                  color: selectedClusterId === c.id ? '#fff' : undefined,
                  borderColor: selectedClusterId === c.id ? 'var(--calc-blue)' : undefined,
                }}
                onClick={() => setSelectedClusterId(c.id)}
              >
                {c.name} ({(c.totalMonthlyVolume / 1000).toFixed(1)}k/mo)
              </button>
            ))}
          </div>

          <div
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--line)',
              borderRadius: '10px',
              padding: '24px',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--calc-blue)' }}>
                  Pillar: {activeCluster.pillarTitle} ({activeCluster.pillarPage})
                </h3>
                <span style={{ fontSize: '12px', background: 'var(--accent-subtle)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  Combined Volume: {activeCluster.totalMonthlyVolume.toLocaleString()} / mo &middot; Avg KD {activeCluster.averageKd}%
                </span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                <strong>Linking Architecture:</strong> {activeCluster.linkingStrategy}
              </p>
            </div>

            {/* Subpages & Anchor Text Table */}
            <h4 style={{ margin: '16px 0 8px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--ink)' }}>
              Supporting Cluster Content &amp; Recommended Exact Anchors:
            </h4>
            <div className="scroll">
              <table style={{ minWidth: '700px' }}>
                <thead>
                  <tr>
                    <th>Cluster Page &amp; URL</th>
                    <th>Target Keyword</th>
                    <th>UK Volume</th>
                    <th>KD %</th>
                    <th>Recommended Anchor Text</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCluster.subPages.map((sub, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{sub.title}</strong>
                        <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{sub.url}</div>
                      </td>
                      <td>{sub.targetKeyword}</td>
                      <td>{sub.volume.toLocaleString()}</td>
                      <td>
                        <span
                          style={{
                            background: sub.kd <= 20 ? 'var(--ok-bg)' : 'rgba(234, 179, 8, 0.15)',
                            color: sub.kd <= 20 ? 'var(--ok)' : '#b45309',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '11px',
                          }}
                        >
                          {sub.kd}%
                        </span>
                      </td>
                      <td>
                        <code style={{ fontSize: '12px', background: 'var(--surface)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--line)' }}>
                          &ldquo;{sub.recommendedAnchor}&rdquo;
                        </code>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-action"
                          style={{ minHeight: '28px', padding: '2px 8px', fontSize: '11px' }}
                          onClick={() => {
                            navigator.clipboard.writeText(`<a href="${sub.url}">${sub.recommendedAnchor}</a>`);
                            alert(`Copied anchor HTML for "${sub.recommendedAnchor}"`);
                          }}
                        >
                          Copy HTML
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: UK BACKLINK & OUTREACH PLAYBOOK */}
      {activeTab === 'outreach' && (
        <section className="c" style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--calc-blue)',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <Send size={16} aria-hidden="true" />
            <span>Organic Authority &amp; Trade Outreach Playbook</span>
          </div>
          <h2 style={{ marginTop: 0 }}>UK High-Authority Link Building Blueprints</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>
            Battle-tested link outreach campaigns targeting UK timber merchants, garden shed manufacturers, and property DIY forums to earn natural, dofollow editorial backlinks.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px 0' }}>
            {UK_OUTREACH_PLAYBOOKS.map((p) => (
              <div
                key={p.id}
                style={{
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: 'var(--calc-blue)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      CAMPAIGN: {p.category}
                    </span>
                    <h3 style={{ margin: '4px 0 0', fontSize: '1.15rem' }}>{p.category}</h3>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted)', background: 'var(--surface)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--line)' }}>
                      Target: {p.estimatedProspects}
                    </span>
                    <button
                      type="button"
                      className="btn-action"
                      style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px' }}
                      onClick={() => handleCopyPitch(p.pitchBody, p.id)}
                    >
                      {copiedPitchId === p.id ? <Check size={13} color="var(--ok)" /> : <Copy size={13} />}
                      <span>{copiedPitchId === p.id ? 'Copied Pitch!' : 'Copy Pitch Email'}</span>
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', marginBottom: '12px' }}>
                  <strong>Target Prospect Profile:</strong> {p.targetAudience} &middot;{' '}
                  <strong>Link Placement:</strong> {p.targetLinkType}
                </div>

                {/* Email Subject & Body Preview */}
                <div
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '6px',
                    padding: '14px',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    color: 'var(--ink)',
                  }}
                >
                  <div style={{ color: 'var(--muted)', marginBottom: '8px', fontWeight: 600 }}>
                    Subject: {p.pitchSubject}
                  </div>
                  {p.pitchBody}
                </div>

                <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--muted)' }}>
                  Suggested Anchors:{' '}
                  {p.suggestedAnchors.map((a, i) => (
                    <span
                      key={i}
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--line)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        marginRight: '6px',
                        color: 'var(--calc-blue)',
                        fontWeight: 600,
                      }}
                    >
                      &ldquo;{a}&rdquo;
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 6: GOOGLE UK SERP SIMULATOR */}
      {activeTab === 'serp' && (
        <section className="c" style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--calc-blue)',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <Eye size={16} aria-hidden="true" />
            <span>Google UK Rich Search Snippet Simulator</span>
          </div>
          <h2 style={{ marginTop: 0 }}>Google.co.uk SERP Snippet Preview</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>
            Test and optimize page title tags and meta descriptions in real-time. Check character boundaries (title &le; 60 chars, meta &le; 155 chars) and preview rich snippet enhancements.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
              margin: '20px 0',
            }}
          >
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
                      setSerpDesc(
                        'Calculate cubic metres, 25kg bags, wet weight, and estimated costs for slabs, bases, footings, post holes, and steps with UK mix guides and worked examples.'
                      );
                    } else if (p === 'block') {
                      setSerpTitle('Concrete Block Calculator UK – 440x215mm Blocks, Mortar & Sand');
                      setSerpDesc(
                        'Calculate concrete blocks per m² (10 blocks/m² rule), building sand bags, cement, and costs for UK single skin and cavity walls (BS EN 771-3).'
                      );
                    } else if (p === 'postcrete') {
                      setSerpTitle('Postcrete Calculator UK – Fence Post Concrete Bags & Hole Depth');
                      setSerpDesc(
                        'Calculate 20kg rapid-set Postcrete bags needed per fence post hole. Includes UK one-third depth rules and alternative 1:5 ballast mix comparisons.'
                      );
                    } else if (p === 'shed') {
                      setSerpTitle('Concrete Shed Base: How Much Concrete Do You Need? (6x4 & 8x6)');
                      setSerpDesc(
                        'Exact volume math and 25kg bag estimates for standard 6x4 and 8x6 garden shed bases. Includes 100mm slab thickness and MOT Type 1 sub-base guide.'
                      );
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
                  <span
                    style={{
                      fontSize: '12px',
                      color: serpTitle.length > 60 ? '#dc2626' : 'var(--ok)',
                    }}
                  >
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
                  <span
                    style={{
                      fontSize: '12px',
                      color: serpDesc.length > 160 ? '#dc2626' : 'var(--ok)',
                    }}
                  >
                    {serpDesc.length} / 155 chars {serpDesc.length > 160 ? '(May truncate)' : '(Optimal)'}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={serpDesc}
                  onChange={(e) => setSerpDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginLeft: 'auto', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showFaqRichSnippet}
                    onChange={(e) => setShowFaqRichSnippet(e.target.checked)}
                  />
                  <span>Show FAQ Accordion</span>
                </label>
              </div>
            </div>

            {/* Google SERP Card Preview */}
            <div
              style={{
                background: '#f8fafc',
                padding: '18px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
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
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#e0f2fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                    }}
                  >
                    🧱
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#202124', lineHeight: 1.2 }}>
                      ConcreteCalc.UK
                    </div>
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
                {showFaqRichSnippet && (
                  <div style={{ borderTop: '1px solid #ebebeb', paddingTop: '8px', marginTop: '6px' }}>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#1a0dab',
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '4px 0',
                      }}
                    >
                      <span>How do I calculate cubic metres of concrete?</span>
                      <span>▾</span>
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#1a0dab',
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '4px 0',
                      }}
                    >
                      <span>How many 25kg bags make 1m³?</span>
                      <span>▾</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 7: TECHNICAL AUDIT & COMPETITORS */}
      {activeTab === 'audit' && (
        <section className="c" style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--calc-blue)',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Technical SEO Audit &amp; Competitive Analysis</span>
          </div>
          <h2 style={{ marginTop: 0 }}>On-Page, Server-Side &amp; Competitor Gap Audit</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>
            Live verification of Googlebot crawl directives, canonical links, indexation rules, Schema.org rich results, and benchmarking against top 5 UK ready-mix domains.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
              margin: '20px 0',
            }}
          >
            <div
              style={{
                background: 'var(--surface-elevated)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Check size={16} color="var(--ok)" />
                <strong style={{ fontSize: '14px' }}>Dynamic XML Sitemap</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>
                Served dynamically via <code>/sitemap.xml</code> with priority scores for all 12 key UK URLs.
              </p>
            </div>

            <div
              style={{
                background: 'var(--surface-elevated)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Check size={16} color="var(--ok)" />
                <strong style={{ fontSize: '14px' }}>Robots.txt Directives</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>
                Configured at <code>/robots.txt</code> allowing full search bot crawling with sitemap reference.
              </p>
            </div>

            <div
              style={{
                background: 'var(--surface-elevated)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Check size={16} color="var(--ok)" />
                <strong style={{ fontSize: '14px' }}>Schema.org FAQPage JSON-LD</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>
                Fully compliant multi-question JSON-LD embedded in layout.tsx targeting Google FAQ rich results.
              </p>
            </div>

            <div
              style={{
                background: 'var(--surface-elevated)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Check size={16} color="var(--ok)" />
                <strong style={{ fontSize: '14px' }}>WebApplication Structured Data</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>
                SoftwareApplication metadata declared with £0 GBP price currency and British English (en-GB).
              </p>
            </div>
          </div>

          {/* Competitor Gap Analysis */}
          <h3 style={{ margin: '28px 0 12px', fontSize: '1.2rem' }}>
            Top 5 UK Competitor Gap Analysis (Google UK &ldquo;concrete calculator&rdquo;)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '10px',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        color: 'var(--calc-blue)',
                        marginRight: '8px',
                      }}
                    >
                      RANK #{c.rank}
                    </span>
                    <strong style={{ fontSize: '15px' }}>{c.title}</strong>
                    <span style={{ fontSize: '12.5px', color: 'var(--muted)', marginLeft: '8px' }}>
                      ({c.domain})
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', fontSize: '12.5px' }}>
                    <span>
                      Authority Score: <strong>{c.authorityScore}</strong>
                    </span>
                    <span>
                      Est. Traffic: <strong>{c.estimatedTraffic}</strong>
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '16px',
                    fontSize: '13px',
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: '#dc2626',
                        fontWeight: 700,
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      Competitor Weaknesses (Our Attack Opportunity):
                    </span>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--ink-secondary)' }}>
                      {c.weaknesses.map((w, idx) => (
                        <li key={idx} style={{ marginBottom: '3px' }}>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span
                      style={{
                        color: 'var(--ok)',
                        fontWeight: 700,
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
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

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'flex-end',
                  marginTop: '20px',
                }}
              >
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
