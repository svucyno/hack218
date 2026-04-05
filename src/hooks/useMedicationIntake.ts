import { useEffect, useMemo, useRef, useState } from 'react';

import { defaultGeneratedSchedule, initialReviewMedicines } from '../data/intakeMockData';
import type { DemoScenarioKey, ReviewMedicine, UploadMethod } from '../types/intake';
import type {
  AdherenceActivityItem,
  CaregiverAlertState,
  MedicationItem,
  MedicationPeriod,
  MedicationStatus,
} from '../types/medication';

const initialActivityHistory: AdherenceActivityItem[] = [
  {
    id: 'initial-demo-ready',
    title: 'Demo schedule ready',
    detail: 'The sample document created a medicine plan for today.',
    timeLabel: 'Just now',
    type: 'system',
  },
];

function buildScheduleFromReview(reviewMedicines: ReviewMedicine[]): MedicationItem[] {
  const active = reviewMedicines.filter((item) => !item.removed && item.confirmed);
  const schedule: MedicationItem[] = [];

  active.forEach((item, index) => {
    const timingParts = item.timing
      .split(' and ')
      .map((part) => part.trim())
      .filter(Boolean);

    timingParts.forEach((timing, timingIndex) => {
      let period: MedicationPeriod = 'Morning';
      const upper = timing.toUpperCase();

      if (upper.includes('PM')) {
        period =
          upper.startsWith('1') ||
          upper.startsWith('2') ||
          upper.startsWith('3') ||
          upper.startsWith('4') ||
          upper.startsWith('5')
            ? 'Afternoon'
            : 'Night';
      }

      schedule.push({
        id: `${item.id}-${timingIndex}`,
        name: item.name,
        dosage: item.dosage || '1 tablet',
        timing,
        period,
        foodTiming: item.foodTiming,
        note: `${item.frequency} for ${item.duration}`,
        status: index === 0 && timingIndex === 0 ? 'Pending' : 'Unconfirmed',
      });
    });
  });

  return schedule.length > 0 ? schedule : defaultGeneratedSchedule;
}

function buildActivityItem(
  type: AdherenceActivityItem['type'],
  title: string,
  detail: string,
  timeLabel: string,
): AdherenceActivityItem {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    detail,
    timeLabel,
    type,
  };
}

function buildScenarioState(scenario: DemoScenarioKey): {
  schedule: MedicationItem[];
  history: AdherenceActivityItem[];
  activeReminderId: string | null;
  summary: string;
} {
  if (scenario === 'smooth') {
    return {
      schedule: defaultGeneratedSchedule.map((item, index) => ({
        ...item,
        status: index < 3 ? 'Taken' : index === 3 ? 'Pending' : 'Pending',
      })),
      history: [
        {
          id: 'smooth-1',
          title: 'Morning medicines handled smoothly',
          detail: 'Most doses were marked taken and no caregiver follow-up is needed.',
          timeLabel: '10:00 AM',
          type: 'system',
        },
      ],
      activeReminderId: defaultGeneratedSchedule[3]?.id ?? null,
      summary: 'Smooth Adherence: most doses are taken and the patient is stable.',
    };
  }

  if (scenario === 'missed') {
    return {
      schedule: defaultGeneratedSchedule.map((item, index) => ({
        ...item,
        status: index === 0 ? 'Taken' : index === 1 ? 'Missed' : index === 2 ? 'Missed' : 'Pending',
      })),
      history: [
        {
          id: 'missed-1',
          title: 'Two doses missed today',
          detail: 'Caregiver attention may be needed because multiple doses were missed.',
          timeLabel: '1:30 PM',
          type: 'caregiver',
        },
      ],
      activeReminderId: defaultGeneratedSchedule[3]?.id ?? null,
      summary: 'Missed Dose Scenario: caregiver concern is visible because two doses were missed.',
    };
  }

  if (scenario === 'no-response') {
    return {
      schedule: defaultGeneratedSchedule.map((item, index) => ({
        ...item,
        status: index === 0 ? 'Taken' : index <= 2 ? 'Unconfirmed' : 'Pending',
      })),
      history: [
        {
          id: 'no-response-1',
          title: 'No response recorded',
          detail: 'Reminder was not answered and doses were marked unconfirmed.',
          timeLabel: '1:00 PM',
          type: 'unconfirmed',
        },
      ],
      activeReminderId: defaultGeneratedSchedule[3]?.id ?? null,
      summary: 'No Response Scenario: reminder was not answered and follow-up may be needed.',
    };
  }

  return {
    schedule: defaultGeneratedSchedule.map((item, index) => ({
      ...item,
      status: index === 0 ? 'Missed' : index === 1 ? 'Unconfirmed' : index === 2 ? 'Missed' : 'Unconfirmed',
    })),
    history: [
      {
        id: 'escalated-1',
        title: 'Caregiver escalation is active',
        detail: 'Multiple missed and unconfirmed doses are visible across the day.',
        timeLabel: 'Now',
        type: 'caregiver',
      },
    ],
    activeReminderId: defaultGeneratedSchedule[4]?.id ?? null,
    summary: 'Escalated Caregiver Scenario: the caregiver view clearly shows intervention is needed.',
  };
}

export function useMedicationIntake() {
  const [selectedUploadMethod, setSelectedUploadMethod] = useState<UploadMethod | null>('sample');
  const [reviewMedicines, setReviewMedicines] = useState<ReviewMedicine[]>(initialReviewMedicines);
  const [scheduleMedicines, setScheduleMedicines] = useState<MedicationItem[]>(defaultGeneratedSchedule);
  const [activityHistory, setActivityHistory] = useState<AdherenceActivityItem[]>(initialActivityHistory);
  const [caregiverAlertHistory, setCaregiverAlertHistory] = useState<AdherenceActivityItem[]>([]);
  const [activeReminderId, setActiveReminderId] = useState<string | null>(null);
  const [demoScenario, setDemoScenario] = useState<DemoScenarioKey | null>(null);
  const [demoScenarioSummary, setDemoScenarioSummary] = useState(
    'Choose a scenario to guide the MedBridge demo from the dashboard.',
  );

  const visibleReviewMedicines = useMemo(
    () => reviewMedicines.filter((item) => !item.removed),
    [reviewMedicines],
  );

  const stats = useMemo(() => {
    const total = scheduleMedicines.length;
    const taken = scheduleMedicines.filter((item) => item.status === 'Taken').length;
    const missed = scheduleMedicines.filter((item) => item.status === 'Missed').length;
    const unconfirmed = scheduleMedicines.filter((item) => item.status === 'Unconfirmed').length;
    const pending = scheduleMedicines.filter((item) => item.status === 'Pending').length;
    const adherencePercent = total === 0 ? 0 : Math.round((taken / total) * 100);
    return { total, taken, missed, unconfirmed, pending, adherencePercent };
  }, [scheduleMedicines]);

  const nextReminder = useMemo(
    () =>
      scheduleMedicines.find((item) => item.status === 'Pending') ??
      scheduleMedicines.find((item) => item.status === 'Unconfirmed') ??
      null,
    [scheduleMedicines],
  );

  const activeReminder = useMemo(
    () => scheduleMedicines.find((item) => item.id === activeReminderId) ?? nextReminder,
    [activeReminderId, nextReminder, scheduleMedicines],
  );

  const caregiverAlert = useMemo<CaregiverAlertState>(() => {
    if (stats.missed >= 2) {
      return {
        active: true,
        level: 'alert',
        reason: 'Two or more doses were marked missed today. Caregiver follow-up is recommended.',
      };
    }

    if (stats.unconfirmed >= 2) {
      return {
        active: true,
        level: 'watch',
        reason: 'Multiple doses are still unconfirmed. A caregiver check-in may be helpful.',
      };
    }

    return {
      active: false,
      level: 'watch',
      reason: 'No caregiver escalation is active right now.',
    };
  }, [stats.missed, stats.unconfirmed]);

  const previousAlertState = useRef(false);

  useEffect(() => {
    if (caregiverAlert.active && !previousAlertState.current) {
      const alertItem = buildActivityItem(
        'caregiver',
        caregiverAlert.level === 'alert' ? 'Caregiver alert triggered' : 'Caregiver watch triggered',
        caregiverAlert.reason,
        'Now',
      );
      setCaregiverAlertHistory((items) => [alertItem, ...items].slice(0, 4));
      setActivityHistory((items) => [alertItem, ...items].slice(0, 8));
    }

    previousAlertState.current = caregiverAlert.active;
  }, [caregiverAlert]);

  const pushActivity = (item: AdherenceActivityItem) => {
    setActivityHistory((items) => [item, ...items].slice(0, 8));
  };

  const applyDemoScenario = (scenario: DemoScenarioKey) => {
    const state = buildScenarioState(scenario);
    setDemoScenario(scenario);
    setDemoScenarioSummary(state.summary);
    setScheduleMedicines(state.schedule);
    setActivityHistory(state.history);
    setCaregiverAlertHistory([]);
    setActiveReminderId(state.activeReminderId);
  };

  const resetDemoState = () => {
    setDemoScenario(null);
    setDemoScenarioSummary('Choose a scenario to guide the MedBridge demo from the dashboard.');
    setScheduleMedicines(defaultGeneratedSchedule);
    setActivityHistory(initialActivityHistory);
    setCaregiverAlertHistory([]);
    setActiveReminderId(defaultGeneratedSchedule.find((item) => item.status === 'Pending')?.id ?? null);
  };

  const selectUploadMethod = (method: UploadMethod) => {
    setSelectedUploadMethod(method);
  };

  const resetReviewMedicines = () => {
    setReviewMedicines(initialReviewMedicines);
  };

  const continueWithSampleDocument = () => {
    setSelectedUploadMethod('sample');
    resetReviewMedicines();
  };

  const confirmMedicine = (id: string) => {
    setReviewMedicines((items) =>
      items.map((item) => (item.id === id ? { ...item, confirmed: true } : item)),
    );
  };

  const editMedicine = (id: string) => {
    setReviewMedicines((items) =>
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          dosage: item.dosage || '500 mg',
          timing: item.timing || '8:30 PM',
          confirmed: true,
          edited: true,
          warnings: item.warnings.filter(
            (warning) => warning !== 'missing-dosage' && warning !== 'unclear-timing',
          ),
        };
      }),
    );
  };

  const removeMedicine = (id: string) => {
    setReviewMedicines((items) =>
      items.map((item) => (item.id === id ? { ...item, removed: true } : item)),
    );
  };

  const generateSchedule = () => {
    const generated = buildScheduleFromReview(reviewMedicines);
    setScheduleMedicines(generated);
    setActiveReminderId(generated.find((item) => item.status === 'Pending')?.id ?? null);
    setActivityHistory([
      buildActivityItem(
        'system',
        'Schedule generated',
        'Medicines were converted into a morning, afternoon, and night plan.',
        'Just now',
      ),
    ]);
    setCaregiverAlertHistory([]);
    setDemoScenario(null);
    setDemoScenarioSummary('Schedule generated successfully. The demo is now following the patient flow.');
    return generated;
  };

  const updateDoseStatus = (id: string, status: MedicationStatus) => {
    let updatedDose: MedicationItem | undefined;

    setScheduleMedicines((items) =>
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }
        updatedDose = { ...item, status };
        return updatedDose;
      }),
    );

    if (!updatedDose) {
      return;
    }

    const titles: Record<MedicationStatus, string> = {
      Pending: 'Dose marked pending',
      Taken: 'Dose confirmed taken',
      Missed: 'Dose marked missed',
      Unconfirmed: 'Dose left unconfirmed',
    };

    const details: Record<MedicationStatus, string> = {
      Pending: `${updatedDose.name} is back in the pending list for review.`,
      Taken: `${updatedDose.name} was marked taken for ${updatedDose.timing}.`,
      Missed: `${updatedDose.name} was marked missed for ${updatedDose.timing}.`,
      Unconfirmed: 'No response recorded. Dose marked as unconfirmed.',
    };

    const activityTypeMap: Record<MedicationStatus, AdherenceActivityItem['type']> = {
      Pending: 'system',
      Taken: 'taken',
      Missed: 'missed',
      Unconfirmed: 'unconfirmed',
    };

    pushActivity(buildActivityItem(activityTypeMap[status], titles[status], details[status], updatedDose.timing));
  };

  const openReminder = (id?: string) => {
    const targetId = id ?? nextReminder?.id ?? null;
    setActiveReminderId(targetId);

    const targetDose = scheduleMedicines.find((item) => item.id === targetId) ?? nextReminder;
    if (targetDose) {
      pushActivity(
        buildActivityItem(
          'reminder',
          'Reminder opened',
          `Reminder opened for ${targetDose.name} at ${targetDose.timing}.`,
          targetDose.timing,
        ),
      );
    }
  };

  const closeReminder = () => {
    setActiveReminderId(null);
  };

  const replayReminderVoice = () => {
    if (!activeReminder) {
      return;
    }

    pushActivity(
      buildActivityItem(
        'reminder',
        'Voice reminder replayed',
        `${activeReminder.name} voice reminder was replayed for the patient.`,
        activeReminder.timing,
      ),
    );
  };

  const remindAgain = () => {
    if (!activeReminder) {
      return;
    }

    pushActivity(
      buildActivityItem(
        'reminder',
        'Reminder delayed briefly',
        `${activeReminder.name} reminder will appear again soon.`,
        activeReminder.timing,
      ),
    );
  };

  const respondToReminder = (status: Extract<MedicationStatus, 'Taken' | 'Missed' | 'Unconfirmed'>) => {
    if (!activeReminder) {
      return;
    }

    updateDoseStatus(activeReminder.id, status);
    closeReminder();
  };

  return {
    selectedUploadMethod,
    reviewMedicines: visibleReviewMedicines,
    scheduleMedicines,
    activityHistory,
    caregiverAlert,
    caregiverAlertHistory,
    nextReminder,
    activeReminder,
    stats,
    demoScenario,
    demoScenarioSummary,
    selectUploadMethod,
    continueWithSampleDocument,
    confirmMedicine,
    editMedicine,
    removeMedicine,
    generateSchedule,
    resetReviewMedicines,
    updateDoseStatus,
    openReminder,
    closeReminder,
    replayReminderVoice,
    remindAgain,
    respondToReminder,
    applyDemoScenario,
    resetDemoState,
  };
}
