import React, { useState, useEffect } from 'react';
import type { CriterionGroup, Criterion, SubItem } from '../types';
import { ScoringType, SCORING_OPTIONS } from '../types';
import { ChevronDownIcon, EditIcon, PlusIcon, TrashIcon } from './icons';

interface ModalState {
  isOpen: boolean;
  mode: 'add' | 'edit' | null;
  type: 'group' | 'criterion' | 'subItem' | null;
  data?: any;
  parentIds?: {
    groupId?: string;
    criterionId?: string;
  };
}

interface CriteriaManagementProps {
  data: CriterionGroup[];
  onAddGroup: (groupData: { name: string; department: string }) => void;
  onUpdateGroup: (group: CriterionGroup) => void;
  onDeleteGroup: (groupId: string) => void;
  onAddCriterion: (groupId: string, criterionData: { name: string }) => void;
  onUpdateCriterion: (groupId: string, criterion: Criterion) => void;
  onDeleteCriterion: (groupId: string, criterionId: string) => void;
  onAddSubItem: (groupId: string, criterionId: string, subItemData: Omit<SubItem, 'id' | 'score'>) => void;
  onUpdateSubItem: (groupId: string, criterionId: string, subItem: SubItem) => void;
  onDeleteSubItem: (groupId: string, criterionId: string, subItemId: string) => void;
}

const CriteriaManagement: React.FC<CriteriaManagementProps> = (props) => {
  const { 
    data, 
    onAddGroup, onUpdateGroup, onDeleteGroup,
    onAddCriterion, onUpdateCriterion, onDeleteCriterion,
    onAddSubItem, onUpdateSubItem, onDeleteSubItem
  } = props;
  
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({'group-1': true});
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, mode: null, type: null });
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (modalState.isOpen && modalState.mode === 'edit') {
      setFormData(modalState.data);
    } else {
      // Set default form data for adding new items
      switch (modalState.type) {
        case 'group':
          setFormData({ name: '', department: '' });
          break;
        case 'criterion':
          setFormData({ name: '' });
          break;
        case 'subItem':
          setFormData({ description: '', scoringGuide: '', scoringType: ScoringType.PASS_FAIL, weight: 10 });
          break;
        default:
          setFormData({});
          break;
      }
    }
  }, [modalState]);
  
  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openModal = (mode: 'add' | 'edit', type: 'group' | 'criterion' | 'subItem', data: any = null, parentIds: any = {}) => {
    setModalState({ isOpen: true, mode, type, data, parentIds });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: null, type: null });
    setFormData({});
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = (e.target as HTMLInputElement).type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? parseInt(value, 10) || 0 : value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { mode, type, parentIds, data: originalData } = modalState;

    if (mode === 'add') {
      switch (type) {
        case 'group':
          onAddGroup(formData);
          break;
        case 'criterion':
          onAddCriterion(parentIds.groupId, formData);
          break;
        case 'subItem':
          onAddSubItem(parentIds.groupId, parentIds.criterionId, formData);
          break;
      }
    } else if (mode === 'edit') {
      switch (type) {
        case 'group':
          onUpdateGroup({ ...originalData, ...formData });
          break;
        case 'criterion':
          onUpdateCriterion(parentIds.groupId, { ...originalData, ...formData });
          break;
        case 'subItem':
          onUpdateSubItem(parentIds.groupId, parentIds.criterionId, { ...originalData, ...formData });
          break;
      }
    }
    closeModal();
  };

  const handleDelete = (type: string, ids: any) => {
    const confirmationText = {
      group: `Bạn có chắc chắn muốn xóa nhóm "${ids.groupName}" không? Thao tác này sẽ xóa tất cả tiêu chí và tiểu mục bên trong.`,
      criterion: `Bạn có chắc chắn muốn xóa tiêu chí "${ids.criterionName}" không?`,
      subItem: `Bạn có chắc chắn muốn xóa tiểu mục "${ids.subItemDescription}" không?`
    };

    if (window.confirm(confirmationText[type])) {
      switch (type) {
        case 'group':
          onDeleteGroup(ids.groupId);
          break;
        case 'criterion':
          onDeleteCriterion(ids.groupId, ids.criterionId);
          break;
        case 'subItem':
          onDeleteSubItem(ids.groupId, ids.criterionId, ids.subItemId);
          break;
      }
    }
  }
  
  const renderModalContent = () => {
    const { type } = modalState;
    if (!type) return null;

    const titles = {
      group: 'Nhóm Tiêu chí',
      criterion: 'Tiêu chí',
      subItem: 'Tiểu mục'
    }
    const title = `${modalState.mode === 'add' ? 'Thêm' : 'Sửa'} ${titles[type]}`;

    return (
      <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
        onClick={closeModal}
      >
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg border border-gray-700" onClick={e => e.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="space-y-4">
              {(type === 'group' || type === 'criterion') && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tên {titles[type]}</label>
                  <input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} required className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              )}
              {type === 'group' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Khoa/Phòng ban</label>
                  <input type="text" name="department" value={formData.department || ''} onChange={handleFormChange} required className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              )}
              {type === 'subItem' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Mô tả</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleFormChange} required rows={3} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Hướng dẫn chấm điểm</label>
                    <textarea name="scoringGuide" value={formData.scoringGuide || ''} onChange={handleFormChange} rows={2} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Loại chấm điểm</label>
                      <select name="scoringType" value={formData.scoringType || ''} onChange={handleFormChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        {Object.values(ScoringType).map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Trọng số</label>
                      <input type="number" name="weight" value={formData.weight || 0} onChange={handleFormChange} required className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white">Hủy</button>
              <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white">Lưu</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Quản lý Tiêu chí</h1>
        <button 
          onClick={() => openModal('add', 'group')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Nhóm
        </button>
      </div>
      <div className="space-y-4">
        {data.map(group => (
          <div key={group.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <div className="w-full p-4 flex justify-between items-center bg-gray-700">
              <button onClick={() => toggleItem(group.id)} className="flex-grow flex items-center text-left">
                <ChevronDownIcon className={`h-6 w-6 mr-3 transform transition-transform ${openItems[group.id] ? 'rotate-180' : ''}`} />
                <span className="font-bold text-lg text-white">{group.name}</span>
              </button>
              <div className="flex space-x-2">
                <button onClick={() => openModal('add', 'criterion', null, { groupId: group.id })} className="p-2 text-gray-400 hover:text-white"><PlusIcon className="h-5 w-5" /></button>
                <button onClick={() => openModal('edit', 'group', group)} className="p-2 text-gray-400 hover:text-white"><EditIcon className="h-5 w-5" /></button>
                <button onClick={() => handleDelete('group', { groupId: group.id, groupName: group.name })} className="p-2 text-red-400 hover:text-red-300"><TrashIcon className="h-5 w-5" /></button>
              </div>
            </div>
            {openItems[group.id] && (
              <div className="p-4 space-y-3">
                {group.criteria.map(criterion => (
                  <div key={criterion.id} className="bg-gray-700/50 rounded-lg">
                     <div className="w-full p-3 flex justify-between items-center">
                        <button onClick={() => toggleItem(criterion.id)} className="flex-grow flex items-center text-left">
                          <ChevronDownIcon className={`h-5 w-5 mr-3 transform transition-transform ${openItems[criterion.id] ? 'rotate-180' : ''}`} />
                          <span className="font-semibold text-gray-300">{criterion.name}</span>
                        </button>
                        <div className="flex space-x-2">
                            <button onClick={() => openModal('add', 'subItem', null, { groupId: group.id, criterionId: criterion.id })} className="p-2 text-gray-400 hover:text-white"><PlusIcon className="h-5 w-5" /></button>
                            <button onClick={() => openModal('edit', 'criterion', criterion, { groupId: group.id })} className="p-2 text-gray-400 hover:text-white"><EditIcon className="h-5 w-5" /></button>
                            <button onClick={() => handleDelete('criterion', { groupId: group.id, criterionId: criterion.id, criterionName: criterion.name })} className="p-2 text-red-400 hover:text-red-300"><TrashIcon className="h-5 w-5" /></button>
                        </div>
                    </div>
                    {openItems[criterion.id] && (
                      <div className="px-4 pb-3 space-y-2">
                        {criterion.subItems.map(subItem => (
                          <div key={subItem.id} className="p-3 border-l-4 border-indigo-500 bg-gray-600/40 rounded-r-lg flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-200">{subItem.description}</p>
                                <p className="text-sm text-gray-400">Loại: {subItem.scoringType} | Trọng số: {subItem.weight}</p>
                              </div>
                              <div className="flex space-x-2 flex-shrink-0 ml-4">
                                  <button onClick={() => openModal('edit', 'subItem', subItem, { groupId: group.id, criterionId: criterion.id })} className="p-2 text-gray-400 hover:text-white"><EditIcon className="h-5 w-5" /></button>
                                  <button onClick={() => handleDelete('subItem', { groupId: group.id, criterionId: criterion.id, subItemId: subItem.id, subItemDescription: subItem.description })} className="p-2 text-red-400 hover:text-red-300"><TrashIcon className="h-5 w-5" /></button>
                              </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {modalState.isOpen && renderModalContent()}
    </div>
  );
};

export default CriteriaManagement;