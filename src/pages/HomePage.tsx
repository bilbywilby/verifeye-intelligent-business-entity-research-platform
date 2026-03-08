import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, History, Building2, MapPin, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast, Toaster } from 'sonner';
import { api } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import type { ResearchProfile, ResearchResult } from '@shared/types';
import { motion } from 'framer-motion';
const STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'FL', name: 'Florida' },
  { code: 'TX', name: 'Texas' },
  { code: 'NY', name: 'New York' },
];
const INDUSTRIES = ['Healthcare', 'Finance', 'Technology', 'Retail', 'Construction', 'Other'];
export function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ResearchProfile>({
    legalName: '',
    state: '',
    industry: 'Healthcare'
  });
  const { data: history = [] } = useQuery<ResearchResult[]>({
    queryKey: ['research-history'],
    queryFn: () => api<ResearchResult[]>('/api/history'),
  });
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.legalName || !form.state) {
      toast.error("Please fill in business name and state");
      return;
    }
    setLoading(true);
    try {
      const result = await api<ResearchResult>('/api/research', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      toast.success("Intelligence gathering complete");
      navigate(`/report/${result.id}`);
    } catch (err) {
      toast.error("Research agent encountered an error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-50 selection:bg-blue-500/30">
      <ThemeToggle />
      <Toaster richColors />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-16 lg:py-24 space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4"
            >
              <Shield className="w-4 h-4" />
              Automated Due Diligence Engine
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
            >
              Verif<span className="text-blue-500">Eye</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 text-balance"
            >
              Instantly aggregate regulatory data, SOS filings, and digital identity markers for any US business entity.
            </motion.p>
          </div>
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Search Terminal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-7"
            >
              <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-500" />
                    Deploy Search Agent
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Enter entity parameters to begin real-time crawling.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSearch} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Registered Legal Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input 
                          placeholder="e.g. Acme Corp LLC"
                          className="pl-10 bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:ring-blue-500"
                          value={form.legalName}
                          onChange={e => setForm(f => ({ ...f, legalName: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Jurisdiction (State)</Label>
                        <Select onValueChange={v => setForm(f => ({ ...f, state: v }))}>
                          <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200">
                            <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            {STATES.map(s => (
                              <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Industry Sector</Label>
                        <Select onValueChange={v => setForm(f => ({ ...f, industry: v }))} defaultValue="Healthcare">
                          <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200">
                            <Briefcase className="w-4 h-4 mr-2 text-slate-500" />
                            <SelectValue placeholder="Industry" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            {INDUSTRIES.map(i => (
                              <SelectItem key={i} value={i}>{i}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button 
                      disabled={loading}
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing Entity...
                        </>
                      ) : (
                        "Run Intelligence Agent"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
            {/* History Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-5 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Recent Dossiers
                </h3>
              </div>
              <div className="space-y-3">
                {history.length === 0 ? (
                  <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-600 text-sm">
                    No recent searches found.
                  </div>
                ) : (
                  history.slice(0, 5).map((h) => (
                    <motion.div
                      key={h.id}
                      whileHover={{ x: 5 }}
                      onClick={() => navigate(`/report/${h.id}`)}
                      className="group p-4 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                            {h.profile.legalName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {h.profile.state} • {h.profile.industry}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className={`text-xs font-mono px-2 py-0.5 rounded ${h.overallRiskScore > 70 ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {h.overallRiskScore}%
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-700" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}