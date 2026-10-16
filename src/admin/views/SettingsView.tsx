import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Shield, RefreshCw, Key, Save, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EmailTemplate, EmailLog } from '../../types';

export const SettingsView: React.FC = () => {
  const { token } = useAuth();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchData = async () => {
    try {
      const [tplRes, logsRes] = await Promise.all([
        fetch('/api/admin/email-templates', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/email-logs', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (tplRes.ok) {
        const tplData = await tplRes.json();
        setTemplates(tplData);
        if (tplData.length > 0 && !selectedTemplate) {
          setSelectedTemplate(tplData[0]);
        }
      }
      if (logsRes.ok) {
        setLogs(await logsRes.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    try {
      const res = await fetch(`/api/admin/email-templates/${selectedTemplate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: selectedTemplate.subject,
          body: selectedTemplate.body
        })
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#0f241a]">
          Rendszerbeállítások & E-mail Sablonok
        </h2>
        <p className="text-xs text-stone-500">
          Automatikus vendégértesítők, iCal naptárszinkronizáció és kimenő e-mail naplók
        </p>
      </div>

      {/* Integrations Status */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#0f241a] flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-[#c5a880]" />
          <span>Külső Rendszerintegrációk Állapota</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-950">
                iCal Naptárszinkron (Airbnb / Booking.com)
              </h4>
              <p className="text-xs text-emerald-800 mt-1">
                Kétirányú naptáregyeztetés aktív. A blokkolt dátumok és külső foglalások azonnal szinkronizálódnak.
              </p>
              <span className="text-[10px] text-emerald-700 font-mono block mt-2">
                iCal feed URL: https://zuzmaravendeghaz.hu/api/ical/export.ics
              </span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-950">
                Online Fizetési Átjáró (SimplePay / SZÉP Kártya)
              </h4>
              <p className="text-xs text-emerald-800 mt-1">
                A 256-bites SSL titkosított fizetési modul éles üzemmódban fut. Bankkártyás és OTP/MBH/K&H SZÉP Kártyás tranzakciók engedélyezve.
              </p>
              <span className="text-[10px] text-emerald-700 font-mono block mt-2">
                Státusz: Online & Üzemkész
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Templates Editor */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-[#0f241a] flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#c5a880]" />
            <span>Automatikus E-mail Sablonok Szerkesztése</span>
          </h3>

          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              Sablon sikeresen elmentve!
            </span>
          )}
        </div>

        {/* Template Select Tabs */}
        <div className="flex gap-2">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedTemplate?.id === tpl.id
                  ? 'bg-[#1b4332] text-white shadow'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {tpl.name}
            </button>
          ))}
        </div>

        {selectedTemplate && (
          <form onSubmit={handleSaveTemplate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                E-mail Tárgya
              </label>
              <input
                type="text"
                required
                value={selectedTemplate.subject}
                onChange={(e) =>
                  setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                E-mail Szövegtörzs (Használható változók: {'{{guestName}}'}, {'{{bookingId}}'}, {'{{roomName}}'}, {'{{checkIn}}'}, {'{{checkOut}}'}, {'{{grandTotal}}'}, {'{{depositPaid}}'})
              </label>
              <textarea
                rows={9}
                required
                value={selectedTemplate.body}
                onChange={(e) =>
                  setSelectedTemplate({ ...selectedTemplate, body: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-[#c5a880]" />
              <span>Sablon Mentése</span>
            </button>
          </form>
        )}
      </div>

      {/* Outgoing Email Logs */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#0f241a]">
          Kiküldött Rendszerüzenetek Naplója ({logs.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-3">Időpont</th>
                <th className="py-2.5 px-3">Címzett</th>
                <th className="py-2.5 px-3">Típus</th>
                <th className="py-2.5 px-3">Tárgy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50">
                  <td className="py-2.5 px-3 text-stone-400 font-mono">
                    {new Date(log.sentAt).toLocaleString('hu-HU')}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#0f241a]">{log.to}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-mono">
                      {log.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-stone-700 truncate max-w-xs">{log.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
