import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import CriteriaManagement from './components/CriteriaManagement';
import Scoring from './components/Scoring';
import Reports from './components/Reports';
import { INITIAL_DATA } from './data/mockData';
import type { View, CriterionGroup, SubItem, Criterion } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('management');
  const [appData, setAppData] = useState<CriterionGroup[]>(INITIAL_DATA);

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  const updateSubItemScore = useCallback((
    groupId: string, 
    criterionId: string, 
    subItemId: string, 
    scoreData: SubItem['score']
  ) => {
    setAppData(prevData => {
      return prevData.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            criteria: group.criteria.map(criterion => {
              if (criterion.id === criterionId) {
                return {
                  ...criterion,
                  subItems: criterion.subItems.map(subItem => {
                    if (subItem.id === subItemId) {
                      return { ...subItem, score: scoreData };
                    }
                    return subItem;
                  }),
                };
              }
              return criterion;
            }),
          };
        }
        return group;
      });
    });
  }, []);

  // --- CRUD Handlers for Criteria Management ---

  const handleAddGroup = (groupData: { name: string; department: string }) => {
    const newGroup: CriterionGroup = {
      ...groupData,
      id: `group-${crypto.randomUUID()}`,
      criteria: [],
    };
    setAppData(prev => [...prev, newGroup]);
  };

  const handleUpdateGroup = (updatedGroup: CriterionGroup) => {
    setAppData(prev => prev.map(g => g.id === updatedGroup.id ? {...g, name: updatedGroup.name, department: updatedGroup.department} : g));
  };
  
  const handleDeleteGroup = (groupId: string) => {
    setAppData(prev => prev.filter(g => g.id !== groupId));
  };

  const handleAddCriterion = (groupId: string, criterionData: { name: string }) => {
    const newCriterion: Criterion = {
      ...criterionData,
      id: `criterion-${crypto.randomUUID()}`,
      subItems: [],
    };
    setAppData(prev => prev.map(g => g.id === groupId ? {...g, criteria: [...g.criteria, newCriterion]} : g));
  };

  const handleUpdateCriterion = (groupId: string, updatedCriterion: Criterion) => {
    setAppData(prev => prev.map(g => {
      if (g.id === groupId) {
        return {...g, criteria: g.criteria.map(c => c.id === updatedCriterion.id ? updatedCriterion : c)}
      }
      return g;
    }));
  };
  
  const handleDeleteCriterion = (groupId: string, criterionId: string) => {
    setAppData(prev => prev.map(g => {
      if (g.id === groupId) {
        return {...g, criteria: g.criteria.filter(c => c.id !== criterionId)};
      }
      return g;
    }));
  };

  const handleAddSubItem = (groupId: string, criterionId: string, subItemData: Omit<SubItem, 'id' | 'score'>) => {
    const newSubItem: SubItem = {
      ...subItemData,
      id: `sub-${crypto.randomUUID()}`,
    };
    setAppData(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g, 
          criteria: g.criteria.map(c => {
            if (c.id === criterionId) {
              return {...c, subItems: [...c.subItems, newSubItem]};
            }
            return c;
          })
        };
      }
      return g;
    }));
  };

  const handleUpdateSubItem = (groupId: string, criterionId: string, updatedSubItem: SubItem) => {
    setAppData(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          criteria: g.criteria.map(c => {
            if (c.id === criterionId) {
              return {...c, subItems: c.subItems.map(si => si.id === updatedSubItem.id ? updatedSubItem : si)};
            }
            return c;
          })
        };
      }
      return g;
    }));
  };

  const handleDeleteSubItem = (groupId: string, criterionId: string, subItemId: string) => {
     setAppData(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          criteria: g.criteria.map(c => {
            if (c.id === criterionId) {
              return {...c, subItems: c.subItems.filter(si => si.id !== subItemId)};
            }
            return c;
          })
        };
      }
      return g;
    }));
  };


  const renderView = () => {
    switch (currentView) {
      case 'management':
        return <CriteriaManagement 
          data={appData}
          onAddGroup={handleAddGroup}
          onUpdateGroup={handleUpdateGroup}
          onDeleteGroup={handleDeleteGroup}
          onAddCriterion={handleAddCriterion}
          onUpdateCriterion={handleUpdateCriterion}
          onDeleteCriterion={handleDeleteCriterion}
          onAddSubItem={handleAddSubItem}
          onUpdateSubItem={handleUpdateSubItem}
          onDeleteSubItem={handleDeleteSubItem}
        />;
      case 'scoring':
        return <Scoring data={appData} updateSubItemScore={updateSubItemScore} />;
      case 'reports':
        return <Reports data={appData} />;
      default:
        return <Scoring data={appData} updateSubItemScore={updateSubItemScore}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300 font-sans">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
