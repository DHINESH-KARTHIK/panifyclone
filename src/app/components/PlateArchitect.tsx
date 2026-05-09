import { useState, useMemo } from 'react';
import { Minus, Plus, Download, Users, Utensils, Info, ChevronDown, ChevronUp, Share2, GlassWater, Coffee, Wine } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import plateImg from './plate.png';
import waterImg from './water.png';
import birImg from './biriyani.png';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface MenuItem {
  id: string;
  category: 'Starters' | 'Main Course' | 'Breads' | 'Desserts' | 'Hot Beverages' | 'Cold Drinks & Juices';
  name: string;
  pricePerPlate: number;
  quantity: number;
  imgUrl: string;
}

const menuItems: MenuItem[] = [
  // ── Starters ──
  { id: 'st1', category: 'Starters', name: 'Veg Spring Rolls', pricePerPlate: 35, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1606335543042-57c525922933?w=400&h=400&fit=crop' },
  { id: 'st2', category: 'Starters', name: 'Paneer Tikka', pricePerPlate: 60, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop' },
  { id: 'st3', category: 'Starters', name: 'Samosa (2 pcs)', pricePerPlate: 25, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop' },
  { id: 'st4', category: 'Starters', name: 'Veg Seekh Kebab', pricePerPlate: 55, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1599487489047-a02fcd60ebe8?w=400&h=400&fit=crop' },
  // ── Main Course ──
  { id: 'm1', category: 'Main Course', name: 'Paneer Butter Masala', pricePerPlate: 120, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1603894584214-51e43343360b?w=400&h=400&fit=crop' },
  { id: 'm2', category: 'Main Course', name: 'Hyderabadi Biryani', pricePerPlate: 150, quantity: 0, imgUrl: birImg },
  { id: 'm3', category: 'Main Course', name: 'Dal Makhani', pricePerPlate: 90, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop' },
  { id: 'm4', category: 'Main Course', name: 'Chicken Tikka Masala', pricePerPlate: 160, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop' },
  { id: 'm5', category: 'Main Course', name: 'Chole Bhature', pricePerPlate: 80, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1626132647523-68a11459a5e5?w=400&h=400&fit=crop' },
  { id: 'm6', category: 'Main Course', name: 'Aloo Gobi', pricePerPlate: 70, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&h=400&fit=crop' },
  { id: 'm7', category: 'Main Course', name: 'Mixed Veg Pulao', pricePerPlate: 85, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=400&h=400&fit=crop' },
  { id: 'm8', category: 'Main Course', name: 'Mutton Rogan Josh', pricePerPlate: 200, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop' },
  // ── Breads ──
  { id: 'b1', category: 'Breads', name: 'Butter Naan', pricePerPlate: 30, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=400&h=400&fit=crop' },
  { id: 'b2', category: 'Breads', name: 'Tandoori Roti', pricePerPlate: 15, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop' },
  { id: 'b3', category: 'Breads', name: 'Garlic Naan', pricePerPlate: 35, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop' },
  { id: 'b4', category: 'Breads', name: 'Puri (2 pcs)', pricePerPlate: 20, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1626132647523-68a11459a5e5?w=400&h=400&fit=crop' },
  { id: 'b5', category: 'Breads', name: 'Jeera Rice', pricePerPlate: 50, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=400&h=400&fit=crop' },
  // ── Desserts ──
  { id: 'd1', category: 'Desserts', name: 'Gulab Jamun (2 pcs)', pricePerPlate: 40, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=400&h=400&fit=crop' },
  { id: 'd2', category: 'Desserts', name: 'Kheer', pricePerPlate: 35, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1624882860025-3614b9b79fdb?w=400&h=400&fit=crop' },
  { id: 'd3', category: 'Desserts', name: 'Ice Cream (2 scoops)', pricePerPlate: 50, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop' },
  { id: 'd4', category: 'Desserts', name: 'Rasgulla', pricePerPlate: 30, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1634462822612-2aa7ced02b1c?w=400&h=400&fit=crop' },
  { id: 'd5', category: 'Desserts', name: 'Gajar Halwa', pricePerPlate: 45, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop' },
  // ── Hot Beverages ──
  { id: 'hb1', category: 'Hot Beverages', name: 'Masala Chai', pricePerPlate: 15, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop' },
  { id: 'hb2', category: 'Hot Beverages', name: 'Filter Coffee', pricePerPlate: 20, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400&h=400&fit=crop' },
  { id: 'hb3', category: 'Hot Beverages', name: 'Cappuccino', pricePerPlate: 45, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&h=400&fit=crop' },
  // ── Cold Drinks & Juices ──
  { id: 'cd1', category: 'Cold Drinks & Juices', name: 'Fresh Mango Lassi', pricePerPlate: 45, quantity: 0, imgUrl: waterImg },
  { id: 'cd2', category: 'Cold Drinks & Juices', name: 'Fresh Orange Juice', pricePerPlate: 40, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop' },
  { id: 'cd3', category: 'Cold Drinks & Juices', name: 'Watermelon Juice', pricePerPlate: 35, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400&h=400&fit=crop' },
  { id: 'cd4', category: 'Cold Drinks & Juices', name: 'Cold Coffee', pricePerPlate: 50, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop' },
  { id: 'cd5', category: 'Cold Drinks & Juices', name: 'Pineapple Cooler', pricePerPlate: 40, quantity: 0, imgUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop' },
];

const CATEGORY_EMOJIS: Record<string, string> = {
  'Starters': '🥗',
  'Main Course': '🍛',
  'Breads': '🫓',
  'Desserts': '🍮',
  'Hot Beverages': '☕',
  'Cold Drinks & Juices': '🥤',
};

export function PlateArchitect() {
  const { isDark } = useTheme();
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [guestCount, setGuestCount] = useState(500);
  const [showPlate, setShowPlate] = useState(true);

  const bg = isDark ? '#0a0f1a' : '#f0f7ff';
  const card = isDark ? '#161e2d' : '#ddeeff';
  const border = isDark ? 'rgba(100, 180, 255, 0.1)' : 'rgba(42,125,212,0.18)';
  const text = isDark ? '#e2e8f0' : '#0d2d52';
  const textMuted = isDark ? 'rgba(148, 163, 184, 0.6)' : '#3a6898';
  const muted = isDark ? 'rgba(30, 41, 59, 0.4)' : '#c8e4ff';
  const accent = isDark ? '#38bdf8' : '#2a7dd4';

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ));
  };

  const selectedItems = items.filter(i => i.quantity > 0 && i.category !== 'Hot Beverages' && i.category !== 'Cold Drinks & Juices');
  const selectedDrinks = items.filter(i => i.quantity > 0 && (i.category === 'Hot Beverages' || i.category === 'Cold Drinks & Juices'));
  const pricePerPlate = items.reduce((sum, item) => sum + (item.pricePerPlate * item.quantity), 0);
  const totalCost = pricePerPlate * guestCount;
  const totalSelected = selectedItems.length + selectedDrinks.length;
  const allSelected = items.filter(i => i.quantity > 0);

  const generateAndSharePDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const quoteNo = `PLF-${Date.now().toString().slice(-6)}`;

    // ── Background header band ──
    doc.setFillColor(42, 125, 212);
    doc.rect(0, 0, pageW, 42, 'F');

    // White accent stripe
    doc.setFillColor(255, 255, 255, 0.15);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.4);
    doc.line(0, 42, pageW, 42);

    // Brand name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text('PLANIFY', 14, 18);

    // Tagline
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 230, 255);
    doc.text('Professional Event Planning', 14, 24);

    // Document title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('FOOD & CATERING QUOTATION', pageW - 14, 16, { align: 'right' });

    // Quote meta
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 230, 255);
    doc.text(`Quote No: ${quoteNo}`, pageW - 14, 22, { align: 'right' });
    doc.text(`Date: ${date}`, pageW - 14, 27, { align: 'right' });
    doc.text(`Quote No: ${quoteNo}`, pageW - 14, 32, { align: 'right' });

    // ── Guest count highlight banner ──
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(14, 46, pageW - 28, 14, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(42, 125, 212);
    doc.text('👥  EVENT CATERING FOR:', 18, 55);
    doc.setFontSize(11);
    doc.setTextColor(20, 80, 160);
    doc.text(`${guestCount.toLocaleString('en-IN')} PERSONS`, pageW - 18, 55, { align: 'right' });

    // ── Section: Prepared by ──
    let y = 66;
    doc.setFillColor(240, 247, 255);
    doc.roundedRect(14, y, pageW - 28, 22, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(42, 125, 212);
    doc.text('PREPARED BY', 18, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    doc.text('Planify Event Management', 18, y + 12);
    doc.text('contact@planify.in  |  +91 98765 43210  |  www.planify.in', 18, y + 17);

    // ── Items table ──
    y += 28;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(42, 125, 212);
    doc.text('CATERING ITEMS', 14, y);
    doc.setDrawColor(42, 125, 212);
    doc.setLineWidth(0.5);
    doc.line(14, y + 1, 14 + 42, y + 1);

    const tableRows = allSelected.map((item, i) => [
      i + 1,
      item.category,
      item.name,
      `${item.quantity} serving${item.quantity > 1 ? 's' : ''}`,
      `Rs.${item.pricePerPlate}`,
      `Rs.${(item.pricePerPlate * item.quantity * guestCount).toLocaleString('en-IN')}`,
    ]);

    // Note below table header
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(`* Totals calculated for ${guestCount.toLocaleString('en-IN')} persons. Rate/Plate × Qty/Plate × No. of Persons = Total.`, 14, y + 3);

    autoTable(doc, {
      startY: y + 10,
      head: [['#', 'Category', 'Item', 'Qty/Plate', 'Rate/Plate', 'Total']],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [42, 125, 212],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center',
      },
      bodyStyles: { fontSize: 8, textColor: [30, 30, 30], halign: 'center' },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 28 },
        2: { halign: 'left', cellWidth: 55 },
        3: { cellWidth: 20 },
        4: { cellWidth: 22 },
        5: { cellWidth: 28 },
      },
      alternateRowStyles: { fillColor: [240, 247, 255] },
      margin: { left: 14, right: 14 },
    });

    // ── Summary box ──
    const afterTable = (doc as any).lastAutoTable.finalY + 8;
    const summaryX = pageW - 14 - 72;

    doc.setFillColor(42, 125, 212);
    doc.roundedRect(summaryX, afterTable, 72, 42, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(200, 230, 255);
    doc.text('SUMMARY', summaryX + 5, afterTable + 7);

    const summaryLines = [
      [`No. of Persons:`, `${guestCount.toLocaleString('en-IN')}`],
      [`Rate / Plate:`, `Rs.${pricePerPlate}`],
      [`Subtotal:`, `Rs.${totalCost.toLocaleString('en-IN')}`],
      [`GST (18%):`, `Rs.${Math.round(totalCost * 0.18).toLocaleString('en-IN')}`],
    ];
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(220, 240, 255);
    summaryLines.forEach(([label, val], i) => {
      doc.text(label, summaryX + 5, afterTable + 14 + i * 6);
      doc.text(val, summaryX + 67, afterTable + 14 + i * 6, { align: 'right' });
    });

    doc.setLineWidth(0.3);
    doc.setDrawColor(255, 255, 255);
    doc.line(summaryX + 5, afterTable + 38, summaryX + 67, afterTable + 38);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('GRAND TOTAL:', summaryX + 5, afterTable + 45);
    doc.text(`Rs.${Math.round(totalCost * 1.18).toLocaleString('en-IN')}`, summaryX + 67, afterTable + 45, { align: 'right' });

    // ── Terms ──
    const termsY = afterTable + 52;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(42, 125, 212);
    doc.text('TERMS & CONDITIONS', 14, termsY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    const terms = [
      '1. This quotation is valid for 15 days from the date of issue.',
      '2. 50% advance payment required to confirm the booking.',
      '3. GST @18% applicable on all services.',
      '4. Prices may vary based on seasonal availability of ingredients.',
      '5. Cancellations within 7 days of the event are non-refundable.',
    ];
    terms.forEach((t, i) => doc.text(t, 14, termsY + 6 + i * 5));

    // ── Footer ──
    const footerY = doc.internal.pageSize.getHeight() - 12;
    doc.setFillColor(42, 125, 212);
    doc.rect(0, footerY - 4, pageW, 20, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(200, 230, 255);
    doc.text(`© ${new Date().getFullYear()} Planify Event Management. All rights reserved.`, pageW / 2, footerY + 3, { align: 'center' });
    doc.text('This is a computer-generated quotation and is valid without a signature.', pageW / 2, footerY + 8, { align: 'center' });

    // ── Share PDF as actual file via Web Share API, fallback to WhatsApp text ──
    const fileName = `Planify_Catering_Quote_${quoteNo}.pdf`;
    const pdfBlob = doc.output('blob');
    const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

    const waText = `🍽️ *Planify Catering Quotation*

*Quote No:* ${quoteNo}
*Date:* ${date}
*No. of Persons:* ${guestCount.toLocaleString('en-IN')}
*Total Items:* ${allSelected.length}
*Rate/Plate:* ₹${pricePerPlate}
*Subtotal:* ₹${totalCost.toLocaleString('en-IN')}
*GST (18%):* ₹${Math.round(totalCost * 0.18).toLocaleString('en-IN')}
*Grand Total:* ₹${Math.round(totalCost * 1.18).toLocaleString('en-IN')}

_Detailed PDF attached. Authorised by Planify Event Management._`;

    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      // Mobile: share the actual PDF file
      navigator.share({
        title: `Planify Catering Quotation - ${quoteNo}`,
        text: waText,
        files: [pdfFile],
      }).catch(() => {
        // User cancelled or error, still download
        doc.save(fileName);
      });
    } else {
      // Desktop: download PDF and open WhatsApp with text
      doc.save(fileName);
      window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: bg, color: text }}>

      {/* Header */}
      <div
        className="px-4 py-3 flex justify-between items-center z-20"
        style={{
          background: isDark ? 'rgba(10,15,26,0.95)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div>
          <h1 className="text-lg font-black flex items-center gap-2" style={{ color: text }}>
            <Utensils className="w-5 h-5" style={{ color: accent }} />
            Plate Architect
          </h1>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: textMuted }}>Gastronomy Planner</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wide" style={{ color: textMuted }}>Total</p>
          <p className="text-xl font-black" style={{ color: text }}>₹{totalCost.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 px-4 py-2.5" 
        style={{ borderBottom: `1px solid ${border}`, background: isDark ? 'rgba(30,41,59,0.4)' : 'rgba(200,228,255,0.4)' }}
      >
        {[
          { label: 'Guests', value: guestCount, icon: <Users className="w-3 h-3" /> },
          { label: 'Items', value: totalSelected, icon: <Utensils className="w-3 h-3" /> },
          { label: 'Per Plate', value: `₹${pricePerPlate}`, icon: <Info className="w-3 h-3" /> },
        ].map((stat, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-center p-2 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
            <div className="flex items-center gap-1 mb-0.5">
              <span style={{ color: accent }}>{stat.icon}</span>
              <p className="text-[9px] uppercase tracking-wider font-bold" style={{ color: textMuted }}>{stat.label}</p>
            </div>
            <p className="text-sm font-black" style={{ color: text }}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">

        {/* Plate Preview */}
        <div style={{ borderBottom: `1px solid ${border}`, background: isDark ? 'linear-gradient(to bottom, #0a0f1a, #161e2d)' : 'linear-gradient(to bottom, #f0f7ff, #f8faff)' }}>
          <button
            onClick={() => setShowPlate(v => !v)}
            className="w-full flex items-center justify-between px-4 py-4"
            style={{ color: text }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-inner" style={{ background: isDark ? '#1e293b' : '#c8e4ff' }}>
                <span className="text-sm">🍽️</span>
              </div>
              <div className="text-left">
                <span className="text-sm font-black block">Plate Preview</span>
                <span className="text-[10px]" style={{ color: textMuted }}>{selectedItems.length} Food • {selectedDrinks.length} Drinks</span>
              </div>
            </div>
            {showPlate ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
          </button>

          <AnimatePresence>
            {showPlate && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col items-center gap-6 px-4 pb-8">
                  {/* Plate Container */}
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex-shrink-0 group">
                    <motion.img 
                      layoutId="plate-img"
                      src={plateImg} 
                      alt="Plate" 
                      className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <AnimatePresence>
                        {selectedItems.length === 0 ? (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center pointer-events-none"
                          >
                            <p className="text-[11px] font-medium italic px-8 leading-relaxed" style={{ color: textMuted }}>
                              Select dishes below to<br/>architect your plate
                            </p>
                          </motion.div>
                        ) : (
                          <div className="relative w-full h-full">
                            {selectedItems.map((item, index) => {
                              const angle = (index / selectedItems.length) * 2 * Math.PI;
                              const radius = 60;
                              const x = Math.cos(angle) * radius;
                              const y = Math.sin(angle) * radius;

                              return (
                                <motion.div
                                  key={item.id}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1, x, y }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  className="absolute left-1/2 top-1/2"
                                  style={{ marginLeft: -24, marginTop: -24 }}
                                >
                                  <div className="relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-[1.5px] border-black/80">
                                      <img loading="lazy" src={item.imgUrl} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-sm" style={{ background: accent }}>
                                      {item.quantity}
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Beverage Tray Redesign */}
                  <AnimatePresence>
                    {selectedDrinks.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="w-full"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Wine className="w-3 h-3" style={{ color: accent }} />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: textMuted }}>Beverage Tray</p>
                          <div className="flex-1 h-px opacity-20" style={{ background: accent }} />
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none px-2">
                          {selectedDrinks.map(drink => (
                            <motion.div 
                              key={drink.id} 
                              layout
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="flex-shrink-0 flex flex-col items-center gap-2"
                            >
                              <div className="relative">
                                <div className="w-16 h-24 rounded-2xl overflow-hidden shadow-xl border-2 border-white/20 bg-white/5 backdrop-blur-md">
                                  <img loading="lazy" src={drink.imgUrl} alt={drink.name} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg border-2 border-white" style={{ background: accent }}>
                                  {drink.quantity}
                                </div>
                              </div>
                              <p className="text-[10px] text-center font-bold max-w-[70px] leading-tight line-clamp-1" style={{ color: text }}>{drink.name}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guest Count */}
        <div className="px-4 py-4" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: accent }} />
              <span className="text-sm font-bold" style={{ color: text }}>Guest Count</span>
            </div>
            <span className="text-2xl font-black" style={{ color: text }}>{guestCount}</span>
          </div>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={guestCount}
            onChange={e => setGuestCount(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: accent, background: `linear-gradient(to right, ${accent} ${(guestCount - 50) / 1950 * 100}%, ${isDark ? 'rgba(100,180,255,0.1)' : 'rgba(138,79,196,0.2)'} 0%)` }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px]" style={{ color: textMuted }}>50</span>
            <span className="text-[10px]" style={{ color: textMuted }}>2,000</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-6 space-y-8">
          {(['Starters', 'Main Course', 'Breads', 'Desserts', 'Hot Beverages', 'Cold Drinks & Juices'] as const).map(category => {
            const catItems = items.filter(i => i.category === category);
            if (!catItems.length) return null;
            return (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm" style={{ background: isDark ? 'rgba(100,180,255,0.08)' : 'rgba(42,125,212,0.1)' }}>
                    {CATEGORY_EMOJIS[category]}
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: text }}>{category}</h3>
                  <div className="flex-1 h-px opacity-20" style={{ background: text }} />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {catItems.map(item => (
                    <motion.div
                      key={item.id}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-2xl p-2.5 flex flex-col gap-2 transition-all"
                      style={{
                        background: item.quantity > 0 
                          ? (isDark ? 'linear-gradient(135deg, #1e293b, #161e2d)' : 'linear-gradient(135deg, #f5f0fb, #ffffff)') 
                          : card,
                        border: `1px solid ${item.quantity > 0 ? accent : border}`,
                        boxShadow: item.quantity > 0 ? `0 10px 20px -10px ${accent}44` : 'none'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative flex-shrink-0">
                          <img loading="lazy" src={item.imgUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt={item.name} />
                          {item.quantity > 0 && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-white" style={{ background: accent }}>
                              {item.quantity}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold leading-tight line-clamp-2" style={{ color: text }}>{item.name}</p>
                          <p className="text-[10px] mt-0.5 font-bold opacity-60" style={{ color: accent }}>₹{item.pricePerPlate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto bg-black/5 dark:bg-white/5 rounded-full p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity === 0}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-black/5 active:scale-90 disabled:opacity-25"
                          style={{ color: text }}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-black" style={{ color: text }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90"
                          style={{ background: accent, color: '#fff' }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Footer CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 py-4 z-20"
        style={{
          background: isDark ? 'rgba(10,15,26,0.97)' : 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)',
          borderTop: `1px solid ${border}`,
        }}
      >
        <button
          onClick={generateAndSharePDF}
          disabled={allSelected.length === 0}
          className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-lg disabled:opacity-40"
          style={{ background: `linear-gradient(135deg, ${accent}, ${isDark ? '#0ea5e9' : '#5aa0e0'})`, color: '#fff' }}
        >
          <Download className="w-4 h-4" />
          Export PDF & Share on WhatsApp
          <Share2 className="w-4 h-4" />
        </button>
        <p className="mt-2 text-center flex items-center justify-center gap-1 text-[10px]" style={{ color: textMuted }}>
          <Info className="w-3 h-3" /> Taxes & service charges applied at checkout
        </p>
      </div>
    </div>
  );
}
