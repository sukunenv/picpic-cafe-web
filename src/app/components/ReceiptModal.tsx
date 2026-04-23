import { X, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReceiptData {
  order_number: string;
  customer_name: string;
  table_number: string;
  items: any[];
  total: number;
  subtotal?: number;
  discount?: number;
  discount_name?: string;
  method: string;
  change: number;
  date: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReceiptData | null;
}

export function ReceiptModal({ isOpen, onClose, data }: ReceiptModalProps) {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden relative z-10 print:shadow-none print:w-full print:max-w-none print:rounded-none"
          >
            <div className="p-8 print:p-0">
              <div className="flex items-center justify-between mb-6 print:hidden">
                <h2 className="text-xl font-black text-[#2D2B55] uppercase tracking-tight">Struk Pesanan</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              {/* Receipt Preview */}
              <div id="receipt-content" className="bg-[#F8F7FF] p-6 rounded-3xl border border-dashed border-gray-200 font-mono text-[11px] leading-tight text-gray-700 shadow-inner print:bg-white print:border-none print:shadow-none print:p-4">
                <div className="text-center mb-4">
                  <p>================================</p>
                  <p className="font-black text-base text-[#2D2B55]">PICPIC CAFE</p>
                  <p>kumpul mencerita</p>
                  <p className="text-gray-300 font-normal">================================</p>
                </div>
                
                <div className="space-y-1 mb-4 text-[10px]">
                  <p>Tgl: {data.date}</p>
                  <p>No : {data.order_number}</p>
                  <p>Customer: {data.customer_name}</p>
                  <p>Meja: {data.table_number || '-'}</p>
                  <p className="text-gray-300 font-normal">--------------------------------</p>
                </div>

                <div className="space-y-2 mb-4">
                  {data.items.map((item, i) => (
                    <div key={i}>
                      <p className="font-bold text-[#2D2B55] uppercase">{item.name}</p>
                      {item.notes && (
                        <p className="text-[10px] italic text-gray-500 mt-0.5">Catatan: {item.notes}</p>
                      )}
                      <div className="flex justify-between">
                        <span>{item.quantity} x {Number(item.price).toLocaleString('id-ID')}</span>
                        <span>{(item.quantity * item.price).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                  <p className="text-gray-300 font-normal pt-2">--------------------------------</p>
                </div>

                <div className="space-y-1 mb-4">
                  {data.discount && data.discount > 0 ? (
                    <>
                      <div className="flex justify-between text-[10px]">
                        <span>Subtotal</span>
                        <span>{data.subtotal?.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-green-600 italic">
                        <span>Disc {data.discount_name || 'Promo'}</span>
                        <span>-Rp {data.discount.toLocaleString('id-ID')}</span>
                      </div>
                      <p className="text-gray-300 font-normal">--------------------------------</p>
                    </>
                  ) : null}
                  <div className="flex justify-between font-black text-sm text-[#2D2B55]">
                    <span>TOTAL</span>
                    <span>{formatPrice(data.total)}</span>
                  </div>
                  <div className="flex justify-between italic opacity-70">
                    <span>Bayar: {data.method}</span>
                  </div>
                  <p className="text-gray-300 font-normal pt-2">================================</p>
                </div>

                <div className="text-center">
                  <p className="font-bold text-[#2D2B55]">Terima kasih!</p>
                  <p className="text-[9px] opacity-50">kedaipicpic.com</p>
                  <p>================================</p>
                </div>
              </div>

              <div className="mt-8 space-y-3 print:hidden">
                <button
                  onClick={handlePrint}
                  className="w-full py-4 bg-[#6367FF] text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#6367FF]/30 active:scale-95"
                >
                  <Printer size={18} />
                  Cetak / Simpan PDF
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
          
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #receipt-content, #receipt-content * {
                visibility: visible;
              }
              #receipt-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 80mm; /* Standard thermal printer width */
                margin: 0;
              }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
