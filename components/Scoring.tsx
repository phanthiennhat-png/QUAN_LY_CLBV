
import React, { useState } from 'react';
import type { CriterionGroup, SubItem, Evidence } from '../types';
import { SCORING_OPTIONS } from '../types';
import { ChevronDownIcon, UploadIcon, FileIcon, TrashIcon } from './icons';

interface ScoringProps {
  data: CriterionGroup[];
  updateSubItemScore: (groupId: string, criterionId: string, subItemId: string, scoreData: SubItem['score']) => void;
}

const Scoring: React.FC<ScoringProps> = ({ data, updateSubItemScore }) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const handleScoreChange = (
    groupId: string, 
    criterionId: string, 
    subItemId: string, 
    currentScore: SubItem['score'],
    field: string,
    value: any
  ) => {
      const newScoreData = {
        status: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        evidence: [],
        ...currentScore,
        [field]: value,
      };
      updateSubItemScore(groupId, criterionId, subItemId, newScoreData);
  };

  const handleFileUpload = (
    groupId: string, 
    criterionId: string, 
    subItemId: string, 
    currentScore: SubItem['score'],
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const newEvidence: Evidence = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      };
      
      const newEvidenceList = [...(currentScore?.evidence || []), newEvidence];
      handleScoreChange(groupId, criterionId, subItemId, currentScore, 'evidence', newEvidenceList);
    }
  };

  const removeEvidence = (
    groupId: string, 
    criterionId: string, 
    subItemId: string, 
    currentScore: SubItem['score'],
    evidenceId: string
  ) => {
      const updatedEvidence = currentScore?.evidence.filter(e => e.id !== evidenceId);
      handleScoreChange(groupId, criterionId, subItemId, currentScore, 'evidence', updatedEvidence);
  };


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Chấm điểm Tiêu chí</h1>
      <div className="space-y-4">
        {data.map(group => (
          <div key={group.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <button onClick={() => toggleItem(group.id)} className="w-full p-4 text-left flex justify-between items-center bg-gray-700 hover:bg-gray-600">
              <span className="font-bold text-lg text-white">{group.name}</span>
              <ChevronDownIcon className={`h-6 w-6 transform transition-transform ${openItems[group.id] ? 'rotate-180' : ''}`} />
            </button>
            {openItems[group.id] && (
              <div className="p-4 space-y-3">
                {group.criteria.map(criterion => (
                  <div key={criterion.id} className="bg-gray-800 rounded-lg">
                     <button onClick={() => toggleItem(criterion.id)} className="w-full p-3 text-left flex justify-between items-center bg-gray-700/50 hover:bg-gray-600/50 rounded-md">
                        <span className="font-semibold text-gray-300">{criterion.name}</span>
                        <ChevronDownIcon className={`h-5 w-5 transform transition-transform ${openItems[criterion.id] ? 'rotate-180' : ''}`} />
                    </button>
                    {openItems[criterion.id] && criterion.subItems.map(subItem => (
                      <div key={subItem.id} className="p-4 my-2 border-l-4 border-indigo-500 bg-gray-700/30 rounded-r-lg">
                        <p className="font-semibold text-gray-200">{subItem.description}</p>
                        <p className="text-sm text-gray-400 mb-4">Hướng dẫn: {subItem.scoringGuide}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Status */}
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Trạng thái</label>
                            <select 
                                value={subItem.score?.status ?? ''}
                                onChange={(e) => handleScoreChange(group.id, criterion.id, subItem.id, subItem.score, 'status', e.target.value)}
                                className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Chọn...</option>
                                {SCORING_OPTIONS[subItem.scoringType].map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                          </div>

                          {/* Date */}
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Ngày thực hiện</label>
                            <input 
                                type="date"
                                value={subItem.score?.date ?? ''}
                                onChange={(e) => handleScoreChange(group.id, criterion.id, subItem.id, subItem.score, 'date', e.target.value)}
                                className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>

                           {/* Notes */}
                           <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Ghi chú</label>
                            <textarea
                                value={subItem.score?.notes ?? ''}
                                onChange={(e) => handleScoreChange(group.id, criterion.id, subItem.id, subItem.score, 'notes', e.target.value)}
                                rows={2}
                                className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            ></textarea>
                           </div>

                            {/* Evidence */}
                           <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Bằng chứng</label>
                                <div className="flex items-center space-x-4">
                                    <label htmlFor={`file-upload-${subItem.id}`} className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                                        <UploadIcon className="h-5 w-5 mr-2" />
                                        Tải lên
                                    </label>
                                    <input id={`file-upload-${subItem.id}`} type="file" className="hidden" onChange={(e) => handleFileUpload(group.id, criterion.id, subItem.id, subItem.score, e)} />
                                </div>
                                <div className="mt-4 space-y-2">
                                {subItem.score?.evidence?.map(evi => (
                                    <div key={evi.id} className="flex items-center justify-between bg-gray-600 p-2 rounded-md">
                                        <div className="flex items-center">
                                            <FileIcon className="h-5 w-5 mr-2 text-gray-400" />
                                            <a href={evi.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{evi.name}</a>
                                        </div>
                                        <button onClick={() => removeEvidence(group.id, criterion.id, subItem.id, subItem.score, evi.id)} className="text-red-400 hover:text-red-300">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                                </div>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scoring;
