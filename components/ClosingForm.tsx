import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { CashClosingRecord } from '../types';
import { PAYMENT_LABELS } from '../constants';

interface ClosingFormProps {
  onSave: (record: Omit<CashClosingRecord, 'id' | 'totalRevenue' | 'finalBalance' | 'aiAnalysis'>) => void;
  onCancel: () => void;
}

export const ClosingForm: React.FC<ClosingFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    openingBalance: '',
    creditCard: '',
    debitCard: '',
    pix: '',
    cash: '',
    boleto: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date: formData.date,
      openingBalance: Number(formData.openingBalance) || 0,
      creditCard: Number(formData.creditCard) || 0,
      debitCard: Number(formData.debitCard) || 0,
      pix: Number(formData.pix) || 0,
      cash: Number(formData.cash) || 0,
      boleto: Number(formData.boleto) || 0,
    });
  };

  const inputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border";

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-600" />
          Novo Fechamento
        </h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Data do Fechamento</label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{PAYMENT_LABELS.openingBalance}</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              type="number"
              name="openingBalance"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.openingBalance}
              onChange={handleChange}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Divider for Revenue Items */}
        <div className="md:col-span-2 mt-2">
          <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Entradas</h4>
          <div className="h-px bg-gray-200 mt-1 mb-3"></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{PAYMENT_LABELS.creditCard}</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              type="number"
              name="creditCard"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.creditCard}
              onChange={handleChange}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{PAYMENT_LABELS.debitCard}</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              type="number"
              name="debitCard"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.debitCard}
              onChange={handleChange}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{PAYMENT_LABELS.pix}</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              type="number"
              name="pix"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.pix}
              onChange={handleChange}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{PAYMENT_LABELS.cash}</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              type="number"
              name="cash"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.cash}
              onChange={handleChange}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">{PAYMENT_LABELS.boleto}</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              type="number"
              name="boleto"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.boleto}
              onChange={handleChange}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        <div className="md:col-span-2 pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Fechamento
          </button>
        </div>
      </form>
    </div>
  );
};