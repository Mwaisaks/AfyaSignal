'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Assessment, PatientInfo, Symptoms, Vitals } from '@/lib/types';
import { villages, commonSymptoms } from '@/lib/mockData';

interface AssessmentFormProps {
  onSubmit: (assessment: Omit<Assessment, 'id' | 'timestamp' | 'chvId' | 'chvName'>) => void;
  onCancel: () => void;
  chvName: string;
  chvId: string;
}

type FormStep = 1 | 2 | 3;

const generateCaseId = () => {
  const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CHILD-2026-${randomNumber}`;
};

export function AssessmentForm({ onSubmit, onCancel, chvName, chvId }: AssessmentFormProps) {
  const [step, setStep] = useState<FormStep>(1);
  const [generatedCaseId, setGeneratedCaseId] = useState<string>('');
  
  useEffect(() => {
    setGeneratedCaseId(generateCaseId());
  }, []);
  
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    childId: '',
    childName: '',
    age: 0,
    ageUnit: 'months',
    parentName: '',
    parentPhone: '',
    village: '',
  });

  const [symptoms, setSymptoms] = useState<Symptoms>({
    fever: false,
    cough: false,
    diarrhea: false,
    difficulty_breathing: false,
    rash: false,
    vomiting: false,
    lethargy: false,
    seizures: false,
  });

  const [vitals, setVitals] = useState<Vitals>({
    temperature: undefined,
    respiratory_rate: undefined,
    heart_rate: undefined,
    weight: undefined,
  });

  const handlePatientChange = (field: keyof PatientInfo, value: any) => {
    setPatientInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSymptomChange = (symptom: keyof Symptoms, value: any) => {
    setSymptoms(prev => ({ ...prev, [symptom]: value }));
  };

  const handleVitalChange = (vital: keyof Vitals, value: any) => {
    setVitals(prev => ({ ...prev, [vital]: value === '' ? undefined : parseFloat(value) }));
  };



  const isStep1Valid = generatedCaseId && patientInfo.childName && patientInfo.age && patientInfo.village;
  
  // Auto-assign the generated case ID to patientInfo when submitting
  const handleSubmit = () => {
    const assessmentData: Omit<Assessment, 'id' | 'timestamp' | 'chvId' | 'chvName'> = {
      patientInfo: {
        ...patientInfo,
        childId: generatedCaseId,
      },
      symptoms,
      vitals,
      status: 'completed',
    };
    onSubmit(assessmentData);
  };
  const isStep2Valid = true; // Symptoms are optional
  const isStep3Valid = true; // At least one vital can be recorded

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Child Health Assessment</CardTitle>
        <CardDescription>Step {step} of 3</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Step 1: Patient Information */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Auto-generated Case ID */}
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Case ID</p>
              <p className="font-mono font-semibold text-foreground">{generatedCaseId}</p>
              <p className="text-xs text-muted-foreground mt-1">(auto-assigned)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Child&apos;s Name *</label>
                <Input
                  placeholder="e.g., Amara Kipchoge"
                  value={patientInfo.childName}
                  onChange={(e) => handlePatientChange('childName', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Age *</label>
                <Input
                  type="number"
                  placeholder="e.g., 18"
                  value={patientInfo.age || ''}
                  onChange={(e) => handlePatientChange('age', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Age Unit *</label>
                <select
                  value={patientInfo.ageUnit}
                  onChange={(e) => handlePatientChange('ageUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input"
                >
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Parent/Guardian Name *</label>
                <Input
                  placeholder="Full name"
                  value={patientInfo.parentName}
                  onChange={(e) => handlePatientChange('parentName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Parent/Guardian Phone</label>
                <Input
                  placeholder="+254712345678"
                  value={patientInfo.parentPhone}
                  onChange={(e) => handlePatientChange('parentPhone', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Village *</label>
              <select
                value={patientInfo.village}
                onChange={(e) => handlePatientChange('village', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input"
              >
                <option value="">Select Village</option>
                {villages.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Symptoms */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">Select any symptoms the child is experiencing</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(symptoms).filter(k => k !== 'other').map((symptom) => (
                <label key={symptom} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={symptoms[symptom as keyof Symptoms] as boolean || false}
                    onChange={(e) => handleSymptomChange(symptom as keyof Symptoms, e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold capitalize">{symptom.replace('_', ' ')}</span>
                </label>
              ))}
            </div>

            {(symptoms.fever || symptoms.cough || symptoms.diarrhea) && (
              <div className="space-y-3 pt-4 border-t border-border">
                <p className="text-sm font-semibold">Duration (days)</p>
                {symptoms.fever && (
                  <div>
                    <label className="text-xs text-muted-foreground">Fever Duration</label>
                    <Input
                      type="number"
                      placeholder="Days"
                      value={symptoms.feverDays || ''}
                      onChange={(e) => handleSymptomChange('feverDays', parseInt(e.target.value) || undefined)}
                    />
                  </div>
                )}
                {symptoms.cough && (
                  <div>
                    <label className="text-xs text-muted-foreground">Cough Duration</label>
                    <Input
                      type="number"
                      placeholder="Days"
                      value={symptoms.coughDays || ''}
                      onChange={(e) => handleSymptomChange('coughDays', parseInt(e.target.value) || undefined)}
                    />
                  </div>
                )}
                {symptoms.diarrhea && (
                  <div>
                    <label className="text-xs text-muted-foreground">Diarrhea Duration</label>
                    <Input
                      type="number"
                      placeholder="Days"
                      value={symptoms.diarrheaDays || ''}
                      onChange={(e) => handleSymptomChange('diarrheaDays', parseInt(e.target.value) || undefined)}
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Other Symptoms</label>
              <Input
                placeholder="Any other observations"
                value={symptoms.other || ''}
                onChange={(e) => handleSymptomChange('other', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 3: Vitals */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">Record any available vital measurements</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Temperature (°C)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 38.5"
                  value={vitals.temperature || ''}
                  onChange={(e) => handleVitalChange('temperature', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Respiratory Rate (breaths/min)</label>
                <Input
                  type="number"
                  placeholder="e.g., 45"
                  value={vitals.respiratory_rate || ''}
                  onChange={(e) => handleVitalChange('respiratory_rate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Heart Rate (bpm)</label>
                <Input
                  type="number"
                  placeholder="e.g., 120"
                  value={vitals.heart_rate || ''}
                  onChange={(e) => handleVitalChange('heart_rate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Weight (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 12.5"
                  value={vitals.weight || ''}
                  onChange={(e) => handleVitalChange('weight', e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
              <p className="text-sm text-foreground font-semibold mb-2">Assessment Summary</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><span className="font-semibold">Child:</span> {patientInfo.childName} ({patientInfo.age} {patientInfo.ageUnit})</p>
                <p><span className="font-semibold">Village:</span> {patientInfo.village}</p>
                <p><span className="font-semibold">Symptoms:</span> {Object.values(symptoms).filter(v => v === true).length} reported</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between pt-6 border-t border-border">
          <div className="flex gap-2">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep((step - 1) as FormStep)}
              >
                Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            
            {step < 3 ? (
              <Button
                onClick={() => setStep((step + 1) as FormStep)}
                disabled={step === 1 && !isStep1Valid}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Complete Assessment
              </Button>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 justify-center pt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full transition-all ${
                s <= step ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
