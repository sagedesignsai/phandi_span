'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from '@/components/ai-elements/loader';
import { toast } from 'sonner';
import { 
  PlayIcon, 
  RefreshCwIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  DatabaseIcon
} from 'lucide-react';

const JOB_SOURCES = [
  { id: 'pnet', name: 'PNet', region: 'South Africa', status: 'active' },
  { id: 'careerjunction', name: 'CareerJunction', region: 'South Africa', status: 'coming-soon' },
  { id: 'jobmail', name: 'JobMail', region: 'South Africa', status: 'coming-soon' },
  { id: 'gumtree', name: 'Gumtree Jobs', region: 'South Africa', status: 'coming-soon' },
  { id: 'indeed', name: 'Indeed', region: 'International', status: 'active' },
  { id: 'linkedin', name: 'LinkedIn', region: 'International', status: 'coming-soon' },
];

export function ScrapingDashboard() {
  const [selectedSources, setSelectedSources] = useState<string[]>(['pnet', 'indeed']);
  const [searchQuery, setSearchQuery] = useState('software developer');
  const [location, setLocation] = useState('Cape Town');
  const [jobType, setJobType] = useState('full-time');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleScrape = async () => {
    if (selectedSources.length === 0) {
      toast.error('Please select at least one source');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/jobs/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sources: selectedSources,
          query: {
            query: searchQuery,
            location,
            jobType,
            limit: 50,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Scraping failed');
      }

      const data = await response.json();
      setResults(data);
      toast.success(`Found ${data.totalJobsFound} jobs, saved ${data.totalJobsSaved}`);
    } catch (error) {
      console.error('Scraping error:', error);
      toast.error('Failed to scrape jobs');
    } finally {
      setLoading(false);
    }
  };

  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <DatabaseIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results?.totalJobsFound || 0}</div>
            <p className="text-xs text-muted-foreground">Last scrape</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved</CardTitle>
            <CheckCircleIcon className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results?.totalJobsSaved || 0}</div>
            <p className="text-xs text-muted-foreground">To database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sources</CardTitle>
            <RefreshCwIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedSources.length}</div>
            <p className="text-xs text-muted-foreground">Active sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <ClockIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? 'Running' : 'Idle'}</div>
            <p className="text-xs text-muted-foreground">Current state</p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Scraping Configuration</CardTitle>
          <CardDescription>
            Configure job search parameters and select sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Parameters */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="query">Search Query</Label>
              <Input
                id="query"
                placeholder="e.g., software developer"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cape Town">Cape Town</SelectItem>
                  <SelectItem value="Johannesburg">Johannesburg</SelectItem>
                  <SelectItem value="Durban">Durban</SelectItem>
                  <SelectItem value="Pretoria">Pretoria</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="South Africa">South Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger id="jobType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Source Selection */}
          <div>
            <Label className="mb-3 block">Job Sources</Label>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {JOB_SOURCES.map((source) => (
                <Card 
                  key={source.id}
                  className={`cursor-pointer transition-all ${
                    selectedSources.includes(source.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-primary/50'
                  } ${source.status === 'coming-soon' ? 'opacity-50' : ''}`}
                  onClick={() => source.status === 'active' && toggleSource(source.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedSources.includes(source.id)}
                          disabled={source.status === 'coming-soon'}
                          onCheckedChange={() => source.status === 'active' && toggleSource(source.id)}
                        />
                        <div>
                          <p className="font-medium">{source.name}</p>
                          <p className="text-xs text-muted-foreground">{source.region}</p>
                        </div>
                      </div>
                      {source.status === 'coming-soon' ? (
                        <Badge variant="outline" className="text-xs">
                          Soon
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-2">
            <Button 
              onClick={handleScrape} 
              disabled={loading || selectedSources.length === 0}
              className="flex-1"
            >
              {loading ? (
                <>
                  <RefreshCwIcon className="size-4 mr-2 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <PlayIcon className="size-4 mr-2" />
                  Start Scraping
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Scraping Results</CardTitle>
            <CardDescription>
              Summary of the last scraping operation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Jobs Found</span>
                  <span className="text-2xl font-bold">{results.totalJobsFound}</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Jobs Saved</span>
                  <span className="text-2xl font-bold text-green-600">{results.totalJobsSaved}</span>
                </div>
              </div>

              {results.errors && results.errors.length > 0 && (
                <div className="border border-destructive/50 rounded-lg p-4 bg-destructive/5">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircleIcon className="size-4 text-destructive" />
                    <span className="font-medium text-sm">Errors ({results.errors.length})</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {results.errors.slice(0, 5).map((error: string, i: number) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
