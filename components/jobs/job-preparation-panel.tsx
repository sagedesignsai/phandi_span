'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ai-elements/loader';
import { 
  BrainIcon, 
  TrendingUpIcon, 
  BuildingIcon, 
  DollarSignIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  BookOpenIcon
} from 'lucide-react';
import type { Job } from '@/lib/models/job';

interface JobPreparationPanelProps {
  job: Job;
  resumeId: string;
}

export function JobPreparationPanel({ job, resumeId }: JobPreparationPanelProps) {
  const [activeTab, setActiveTab] = useState('interview');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const fetchPreparation = async (type: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/jobs/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id, resumeId, type }),
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch preparation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (!data || data.type !== value) {
      fetchPreparation(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainIcon className="size-5" />
          AI-Powered Job Preparation
        </CardTitle>
        <CardDescription>
          Get personalized insights and preparation materials for {job.title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="interview">Interview</TabsTrigger>
            <TabsTrigger value="skill-gap">Skills</TabsTrigger>
            <TabsTrigger value="career-path">Career</TabsTrigger>
            <TabsTrigger value="company-research">Company</TabsTrigger>
            <TabsTrigger value="salary-insights">Salary</TabsTrigger>
          </TabsList>

          <TabsContent value="interview" className="space-y-4">
            {loading ? (
              <Loader />
            ) : data?.commonQuestions ? (
              <>
                <div>
                  <h3 className="font-semibold mb-2">Common Questions</h3>
                  <div className="space-y-3">
                    {data.commonQuestions.map((q: any, i: number) => (
                      <div key={i} className="border rounded-lg p-3">
                        <p className="font-medium text-sm">{q.question}</p>
                        <p className="text-sm text-muted-foreground mt-1">{q.suggestedAnswer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Technical Questions</h3>
                  <div className="space-y-3">
                    {data.technicalQuestions.map((q: any, i: number) => (
                      <div key={i} className="border rounded-lg p-3">
                        <p className="font-medium text-sm">{q.question}</p>
                        <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
                          {q.hints.map((hint: string, j: number) => (
                            <li key={j}>{hint}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Button onClick={() => fetchPreparation('interview')}>
                Generate Interview Prep
              </Button>
            )}
          </TabsContent>

          <TabsContent value="skill-gap" className="space-y-4">
            {loading ? (
              <Loader />
            ) : data?.matchedSkills ? (
              <>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircleIcon className="size-4 text-green-600" />
                    Matched Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.matchedSkills.map((skill: string) => (
                      <Badge key={skill} variant="default">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircleIcon className="size-4 text-orange-600" />
                    Skills to Develop
                  </h3>
                  <div className="space-y-3">
                    {data.missingSkills.map((item: any, i: number) => (
                      <div key={i} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{item.skill}</span>
                          <Badge variant={
                            item.priority === 'high' ? 'destructive' : 
                            item.priority === 'medium' ? 'default' : 'secondary'
                          }>
                            {item.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpenIcon className="size-3" />
                          <span>Learning resources:</span>
                        </div>
                        <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
                          {item.learningResources.map((resource: string, j: number) => (
                            <li key={j}>{resource}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Recommendations</h3>
                  <ul className="space-y-2">
                    {data.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <Button onClick={() => fetchPreparation('skill-gap')}>
                Analyze Skill Gap
              </Button>
            )}
          </TabsContent>

          <TabsContent value="career-path" className="space-y-4">
            {loading ? (
              <Loader />
            ) : data?.nextSteps ? (
              <>
                <div>
                  <h3 className="font-semibold mb-2">Current Level</h3>
                  <p className="text-sm text-muted-foreground">{data.currentLevel}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUpIcon className="size-4" />
                    Career Progression
                  </h3>
                  <div className="space-y-3">
                    {data.nextSteps.map((step: any, i: number) => (
                      <div key={i} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{step.role}</span>
                          <Badge variant="outline">{step.timeframe}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {step.requiredSkills.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Button onClick={() => fetchPreparation('career-path')}>
                Get Career Path Suggestions
              </Button>
            )}
          </TabsContent>

          <TabsContent value="company-research" className="space-y-4">
            {loading ? (
              <Loader />
            ) : data ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm">{data}</div>
              </div>
            ) : (
              <Button onClick={() => fetchPreparation('company-research')}>
                <BuildingIcon className="size-4 mr-2" />
                Research Company
              </Button>
            )}
          </TabsContent>

          <TabsContent value="salary-insights" className="space-y-4">
            {loading ? (
              <Loader />
            ) : data?.marketRate ? (
              <>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <DollarSignIcon className="size-4" />
                    Market Rate
                  </h3>
                  <p className="text-2xl font-bold text-primary">{data.marketRate}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Negotiation Tips</h3>
                  <ul className="space-y-2">
                    {data.negotiationTips.map((tip: string, i: number) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <CheckCircleIcon className="size-4 text-green-600 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Your Justification</h3>
                  <p className="text-sm text-muted-foreground">{data.justification}</p>
                </div>
              </>
            ) : (
              <Button onClick={() => fetchPreparation('salary-insights')}>
                Get Salary Insights
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
