import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ToolStats, ToolUsage } from '@/types';
import { motion } from 'framer-motion';

interface ToolUsageChartProps {
  toolStats: ToolStats | null;
  recentUsage: ToolUsage[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const ToolUsageChart: React.FC<ToolUsageChartProps> = ({ toolStats, recentUsage }) => {
  if (!toolStats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const chartData = Object.entries(toolStats.tools).map(([name, tool]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    usage_count: tool.usage_count,
    description: tool.description
  }));

  const pieData = chartData.filter(item => item.usage_count > 0);

  const getExecutionTimeData = () => {
    const timeData = recentUsage
      .filter(usage => usage.status === 'success')
      .slice(-10)
      .map((usage, index) => ({
        execution: `#${index + 1}`,
        time: parseFloat(usage.execution_time.toFixed(3)),
        tool: usage.tool_name
      }));
    
    return timeData;
  };

  const executionTimeData = getExecutionTimeData();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="text-2xl font-bold text-primary-600">
            {toolStats.total_executions}
          </div>
          <div className="text-sm text-gray-600">Total Executions</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="text-2xl font-bold text-green-600">
            {Object.keys(toolStats.tools).length}
          </div>
          <div className="text-sm text-gray-600">Available Tools</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="text-2xl font-bold text-orange-600">
            {recentUsage.filter(u => u.status === 'success').length}
          </div>
          <div className="text-sm text-gray-600">Successful Runs</div>
        </motion.div>
      </div>

      {/* Bar Chart - Tool Usage */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Usage Statistics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis fontSize={12} />
            <Tooltip 
              formatter={(value, name, props) => [
                value,
                'Usage Count',
                props.payload.description
              ]}
              labelFormatter={(label) => `Tool: ${label}`}
            />
            <Bar dataKey="usage_count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Usage Distribution */}
        {pieData.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="usage_count"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Execution Time Chart */}
        {executionTimeData.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Execution Times</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={executionTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="execution" fontSize={12} />
                <YAxis fontSize={12} label={{ value: 'Time (s)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}s`,
                    'Execution Time',
                    `Tool: ${props.payload.tool}`
                  ]}
                />
                <Bar dataKey="time" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Recent Tool Usage List */}
      {recentUsage.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tool Executions</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentUsage.slice(-5).reverse().map((usage) => (
              <div key={usage.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    usage.status === 'success' ? 'bg-green-500' : 
                    usage.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-sm">{usage.tool_name}</div>
                    <div className="text-xs text-gray-600">
                      {new Date(usage.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{usage.execution_time.toFixed(2)}s</div>
                  <div className={`text-xs capitalize ${
                    usage.status === 'success' ? 'text-green-600' : 
                    usage.status === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {usage.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};