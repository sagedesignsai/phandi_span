'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from '@/components/ai-elements/loader';
import { EnhancedJobMatchCard } from './enhanced-job-match-card';
import { JobPreferencesForm } from './job-preferences-form';
import { 
  SearchIcon, 
  SlidersHorizontalIcon, 
  SparklesIcon,
  TrendingUpIcon,
  MapPinIcon,
  BriefcaseIcon
} from 'lucide-react';
import type { JobMatch, Job } from '@/lib/models/job';

interface JobDiscoveryDashboardProps {
  userId: string;
  resumeId?: string;
}

export function JobDiscoveryDashboard({ userId, resumeId }: JobDiscoveryDashboardProps) {
  const [activeTab, setActiveTab] = useState('matches');
  const [matches, setMatches] = useState<(JobMatch & { job: Job })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('70');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, [scoreFilter]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        minScore: scoreFilter,
        limit: '50',
      });
      if (resumeId) {
        params.append('resumeId', resumeId);
      }
      const response = await fetch(`/api/jobs/matches?${params}`);
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match => {
    const matchesSearch = !searchQuery || 
      match.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.job.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === 'all' || 
      match.job.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  const stats = {
    total: matches.length,
    highMatch: matches.filter(m => m.match_score >= 80).length,
    applied: matches.filter(m => m.status === 'applied').length,
    new: matches.filter(m => m.status === 'new').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <SparklesIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Based on your profile</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Matches</CardTitle>
            <TrendingUpIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highMatch}</div>
            <p className="text-xs text-muted-foreground">80%+ match score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applied</CardTitle>
            <BriefcaseIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applied}</div>
            <p className="text-xs text-muted-foreground">Applications sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Today</CardTitle>
            <MapPinIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new}</div>
            <p className="text-xs text-muted-foreground">Fresh opportunities</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="cape town">Cape Town</SelectItem>
                  <SelectItem value="johannesburg">Johannesburg</SelectItem>
                  <SelectItem value="durban">Durban</SelectItem>
                  <SelectItem value="pretoria">Pretoria</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>

              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Min Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Matches</SelectItem>
                  <SelectItem value="50">50%+ Match</SelectItem>
                  <SelectItem value="70">70%+ Match</SelectItem>
                  <SelectItem value="80">80%+ Match</SelectItem>
                  <SelectItem value="90">90%+ Match</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontalIcon className="size-4" />
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="cursor-pointer">Full-time</Badge>
                <Badge variant="secondary" className="cursor-pointer">Part-time</Badge>
                <Badge variant="secondary" className="cursor-pointer">Contract</Badge>
                <Badge variant="secondary" className="cursor-pointer">Remote</Badge>
                <Badge variant="secondary" className="cursor-pointer">Hybrid</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matches">
            Matches ({filteredMatches.length})
          </TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-4 mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : filteredMatches.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <SparklesIcon className="size-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                  Try adjusting your filters or update your preferences to see more job matches.
                </p>
                <Button onClick={() => setActiveTab('preferences')}>
                  Update Preferences
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredMatches.map((match) => (
                <EnhancedJobMatchCard key={match.id} match={match} resumeId={resumeId} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
              <CardDescription>
                Customize your job search preferences to get better matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobPreferencesForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Skills in Demand</CardTitle>
                <CardDescription>Based on your matched jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['React', 'TypeScript', 'Node.js', 'Python', 'AWS'].map((skill, i) => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-sm">{skill}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${100 - i * 15}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8">
                          {100 - i * 15}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Salary Insights</CardTitle>
                <CardDescription>Average for your matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold">R45,000 - R85,000</div>
                    <p className="text-sm text-muted-foreground">Monthly salary range</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Entry Level</span>
                      <span className="font-medium">R35,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mid Level</span>
                      <span className="font-medium">R65,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Senior Level</span>
                      <span className="font-medium">R95,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
