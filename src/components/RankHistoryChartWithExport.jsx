import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { RankHistoryService } from '../services/rankHistoryService';
import ExportPdfButton from './ExportPdfButton';
import { PdfExportService } from '../services/pdfExportService';

const { FiTrendingUp, FiTrendingDown, FiMinus, FiCalendar, FiDownload, FiTrash2, FiGrid } = FiIcons;

function RankHistoryChartWithExport({ keyword, domain }) {
  // ... rest of your component code ...

  const handleExportPdf = async (whiteLabelSettings) => {
    if (!chartRef.current) return false;
    return await PdfExportService.exportRankHistory(keyword, domain, chartRef.current, whiteLabelSettings);
  };

  const handleExportTablePdf = async (whiteLabelSettings) => {
    const data = RankHistoryService.getHistoryForKeyword(keyword, domain, timeRange);
    return await PdfExportService.exportRankHistoryTable(data, whiteLabelSettings);
  };

  // ... rest of your component code ...
}

export default RankHistoryChartWithExport;