import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ResearchResult } from '@shared/types';
import { 
  ShieldCheck, AlertTriangle, ExternalLink, ArrowLeft, 
  Calendar, Info, FileText, Globe, Fingerprint, Activity 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
export function ReportPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { data: result, isLoading, error } = useQuery<ResearchResult>({
    queryKey: ['research-report', reportId],
    queryFn: () => api<ResearchResult>(`/api/research/${reportId}`),
    enabled: !!reportId,
  });
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-2" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (error || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
        <p className="text-slate-500 mb-6 text-center">The requested dossier ID does not exist or has expired from our cache.</p>
        <Button onClick={() => navigate('/')}>Return to Command Center</Button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')} 
                className="-ml-2 text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                {result.profile.legalName}
                <Badge variant="outline" className="border-blue-500/50 text-blue-500">Dossier ID: {result.id.slice(0,8)}</Badge>
              </h1>
              <p className="text-slate-500 text-sm flex items-center gap-4">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(result.timestamp).toLocaleString()}</span>
                <span className="flex items-center gap-1"><Fingerprint className="w-3.5 h-3.5" /> Jurisdiction: {result.profile.state}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Export PDF</Button>
              <Button className="bg-blue-600 hover:bg-blue-500 text-white">Share Dossier</Button>
            </div>
          </div>
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left Column: Summary & Scores */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="border-none shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity className="w-24 h-24" />
                </div>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Entity Trust Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-6xl font-bold tabular-nums">
                    {result.overallRiskScore}<span className="text-2xl text-slate-500">/100</span>
                  </div>
                  <Progress value={result.overallRiskScore} className="h-2 bg-slate-700" />
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-sm italic text-slate-300">
                    "{result.summary}"
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Risk Signals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.records.flatMap(r => r.riskFlags).length === 0 ? (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm">
                        <ShieldCheck className="w-4 h-4" />
                        No high-risk indicators detected.
                      </div>
                    ) : (
                      result.records.flatMap((r, i) => r.riskFlags.map(f => (
                        <div key={`${i}-${f}`} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-red-900 dark:text-red-400">{f}</p>
                            <p className="text-xs text-red-700/70 dark:text-red-400/50">Flagged via {r.source}</p>
                          </div>
                        </div>
                      )))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Right Column: Data Sources */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Intelligence Feed
              </h2>
              <div className="grid gap-6">
                {result.records.map((record, idx) => (
                  <motion.div
                    key={record.source}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {record.source.includes('SOS') ? <Building2 className="w-4 h-4 text-slate-500" /> : <Globe className="w-4 h-4 text-slate-500" />}
                              <h4 className="font-bold text-slate-900 dark:text-slate-100">{record.source}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={record.status === 'active' ? 'default' : record.status === 'error' ? 'destructive' : 'secondary'}
                                className={record.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
                              >
                                {record.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          {record.rawUrl && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={record.rawUrl} target="_blank" rel="noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border dark:border-slate-800">
                          {record.details}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              {/* Digital Footprint Mock Segment */}
              <Card className="border-dashed">
                <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Info className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Professional Network Analysis</h4>
                    <p className="text-sm text-slate-500 max-w-sm">LinkedIn and Glassdoor cross-referencing is performed for Enterprise Tier users only.</p>
                  </div>
                  <Button variant="outline" size="sm">Upgrade to Unlock</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}