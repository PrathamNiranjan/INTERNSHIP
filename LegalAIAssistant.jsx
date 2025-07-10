import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, FileText, MessageCircle, AlertTriangle, Search, Download,
  Eye, CheckCircle, XCircle, Clock, Shield, Scale, Brain, BookOpen,
  ChevronDown, ChevronUp, Loader2
} from 'lucide-react';

const LegalAIAssistant = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentSummary, setDocumentSummary] = useState('');
  const [error, setError] = useState(null);
  const [expandedClauses, setExpandedClauses] = useState({});
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Mock data for when backend isn't available
  const mockClauses = [
    { 
      type: 'Termination', 
      content: 'Either party may terminate this agreement with 30 days written notice. In case of material breach, the non-breaching party may terminate immediately upon written notice.',
      description: 'Standard termination clause with notice period',
      risk: 'low', 
      page: 3 
    },
    { 
      type: 'Liability', 
      content: 'Liability shall not exceed the total amount paid under this agreement in the 12 months preceding the claim. Neither party shall be liable for any indirect, special, incidental or consequential damages.',
      description: 'Limitation of liability clause',
      risk: 'medium', 
      page: 5 
    },
    { 
      type: 'Confidentiality', 
      content: 'All confidential information shall remain proprietary and shall not be disclosed to any third party without prior written consent, except as required by law. This obligation survives termination for 5 years.',
      description: 'Standard confidentiality obligations',
      risk: 'low', 
      page: 2 
    },
    { 
      type: 'Payment', 
      content: 'Payment terms are net 30 days from invoice date. Late payments shall accrue interest at 1.5% per month or the maximum rate allowed by law, whichever is lower.',
      description: 'Payment terms and late fees',
      risk: 'low', 
      page: 4 
    },
    { 
      type: 'Indemnification', 
      content: 'Party A shall indemnify Party B for all claims arising from Party A\'s breach of representations and warranties, negligence, or willful misconduct. This includes attorney fees and settlement amounts.',
      description: 'Broad indemnification clause',
      risk: 'high', 
      page: 6 
    },
    { 
      type: 'Governing Law', 
      content: 'This agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of laws principles.',
      description: 'Jurisdiction and governing law',
      risk: 'low', 
      page: 8 
    }
  ];

  const mockRiskStats = {
    high: 1,
    medium: 1,
    low: 4,
    total: 6
  };

  const mockSummary = "This contract appears to be a standard services agreement between two parties. It includes typical provisions for termination, liability limitations, confidentiality, payment terms, and indemnification. The indemnification clause presents higher risk due to its broad language. Other clauses are fairly standard with moderate to low risk. The document is well-structured with clear terms and conditions.";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleClauseExpansion = (index) => {
    setExpandedClauses(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);
    setError(null);

    // Check file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
      setIsProcessing(false);
      return;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      setIsProcessing(false);
      return;
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // In a real app, you would send to your backend here
      // const formData = new FormData();
      // formData.append("file", file);
      // const response = await fetch("http://localhost:5000/upload", {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await response.json();

      // For demo purposes, we'll use mock data
      const mockData = {
        analysis: {
          clauses: mockClauses,
          risks: mockRiskStats,
          processed: true,
          filename: file.name,
          summary: mockSummary,
          text: "This is a simulated extracted text from the document. In a real implementation, this would contain the actual text extracted from your uploaded document."
        }
      };

      setAnalysisResults({
        clauses: mockData.analysis.clauses,
        risks: mockData.analysis.risks,
        processed: true,
        filename: mockData.analysis.filename
      });
      setDocumentSummary(mockData.analysis.summary);
      setExtractedText(mockData.analysis.text);
      setActiveTab("analysis");
    } catch (err) {
      console.error("Upload failed", err);
      setError('Failed to process document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !extractedText) return;

    const userMessage = { type: 'user', content: inputMessage };
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI thinking
    setIsProcessing(true);
    
    try {
      // In a real app, you would call your backend here
      // const response = await fetch("http://localhost:5000/chat", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     question: inputMessage,
      //     document_text: extractedText
      //   }),
      // });
      // const data = await response.json();

      // For demo purposes, we'll generate mock responses
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let aiResponse;
      const lowerInput = inputMessage.toLowerCase();
      
      if (lowerInput.includes('termination')) {
        aiResponse = "The termination clause allows either party to end the agreement with 30 days written notice. In cases of material breach, immediate termination is permitted. This is a fairly standard termination provision with moderate flexibility.";
      } else if (lowerInput.includes('liability') || lowerInput.includes('liable')) {
        aiResponse = "The liability clause limits damages to the amount paid in the preceding 12 months and excludes indirect damages. This is a typical limitation but could be problematic if the contract value is low relative to potential risks.";
      } else if (lowerInput.includes('confidential') || lowerInput.includes('nda')) {
        aiResponse = "Confidentiality obligations are standard, requiring written consent for disclosures and surviving for 5 years post-termination. The terms are reasonable but should be reviewed against your specific information protection needs.";
      } else if (lowerInput.includes('payment') || lowerInput.includes('fee')) {
        aiResponse = "Payment terms are net 30 with 1.5% monthly interest on late payments (or the maximum legal rate). These are common payment terms but the late fee could be negotiated lower if needed.";
      } else if (lowerInput.includes('indemn') || lowerInput.includes('hold harmless')) {
        aiResponse = "The indemnification clause is broad, covering breaches, negligence and willful misconduct including legal fees. This presents higher risk and may warrant negotiation to limit scope or add caps.";
      } else if (lowerInput.includes('governing law') || lowerInput.includes('jurisdiction')) {
        aiResponse = "California law governs this agreement without regard to conflict of laws principles. This is important for dispute resolution and should align with your preferred legal jurisdiction.";
      } else {
        aiResponse = `Based on the document analysis, here's what I found regarding "${inputMessage}": The contract contains relevant clauses that may address your question. For more specific information, please ask about termination, liability, confidentiality, payment terms, or indemnification.`;
      }

      setChatMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
    } catch (err) {
      console.error("Chat failed", err);
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        content: "I'm having trouble processing your question right now. Please try again later or ask a different question." 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    if (!analysisResults) return;
    
    const exportData = {
      summary: documentSummary,
      clauses: analysisResults.clauses,
      risks: analysisResults.risks,
      filename: uploadedFile?.name || 'unknown',
      timestamp: new Date().toISOString(),
      metadata: {
        generatedBy: "AI Legal Assistant",
        version: "1.0"
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `legal-analysis-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'high': return <XCircle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const event = { target: { files: [file] } };
      handleFileUpload(event);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Legal Assistant
              </h1>
              <p className="text-sm text-gray-600">Equinoxis LegalTech Division</p>
            </div>
          </div>
          <div className="bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-blue-700">Beta v1.0</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'upload', label: 'Upload Document', icon: Upload },
              { id: 'analysis', label: 'Document Analysis', icon: FileText },
              { id: 'chat', label: 'Legal Q&A', icon: MessageCircle },
              { id: 'comparison', label: 'Compare Docs', icon: Eye }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Upload Legal Document</h2>
            <p className="text-gray-600">Support for PDF, DOCX, and TXT files up to 10MB</p>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-md mx-auto">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
              </h3>
              <p className="text-gray-500">PDF, DOCX, TXT up to 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            {isProcessing && (
              <div className="text-blue-600 flex justify-center items-center space-x-2 mt-4">
                <Loader2 className="animate-spin rounded-full h-4 w-4" />
                <span>Processing document with AI...</span>
              </div>
            )}
            
            {uploadedFile && !isProcessing && !analysisResults && (
              <button
                onClick={() => setActiveTab('analysis')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Analysis
              </button>
            )}
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {analysisResults ? (
              <>
                {/* Document Summary */}
                {documentSummary && (
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <h2 className="text-xl font-bold">Document Summary</h2>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">{documentSummary}</p>
                    </div>
                  </div>
                )}

                {/* Dashboard */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold">Document Risk Assessment</h2>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setActiveTab('chat')}
                        className="text-sm bg-purple-100 text-purple-800 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center space-x-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Ask Questions</span>
                      </button>
                      <button 
                        onClick={handleExport}
                        className="text-sm bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-1"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Report</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'High Risk', icon: <XCircle className="text-red-600" />, count: analysisResults.risks.high, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900' },
                      { label: 'Medium Risk', icon: <AlertTriangle className="text-yellow-600" />, count: analysisResults.risks.medium, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900' },
                      { label: 'Low Risk', icon: <CheckCircle className="text-green-600" />, count: analysisResults.risks.low, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900' },
                      { label: 'Total Clauses', icon: <FileText className="text-blue-600" />, count: analysisResults.risks.total, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900' }
                    ].map((item, index) => (
                      <div key={index} className={`${item.bg} ${item.border} rounded-lg p-4`}>
                        <div className="flex items-center space-x-2">
                          {item.icon}
                          <span className={`font-medium ${item.text}`}>{item.label}</span>
                        </div>
                        <div className={`text-2xl font-bold ${item.text} mt-1`}>{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clauses */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Extracted Clauses</h3>
                  {analysisResults.clauses.length > 0 ? (
                    <div className="space-y-4">
                      {analysisResults.clauses.map((clause, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium">{clause.type}</span>
                              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getRiskBadgeColor(clause.risk)}`}>
                                {getRiskIcon(clause.risk)}
                                <span>{clause.risk.toUpperCase()}</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">Page {clause.page}</span>
                              <button 
                                onClick={() => toggleClauseExpansion(index)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {expandedClauses[index] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{clause.description}</p>
                          {expandedClauses[index] && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{clause.content}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Brain className="mx-auto w-12 h-12 text-gray-300 mb-2" />
                      <p>No clauses detected. Try uploading a different document.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <FileText className="mx-auto w-12 h-12 text-gray-300 mb-2" />
                <p>No document analyzed yet. Upload a document to get started.</p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Document
                </button>
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg flex flex-col" style={{ minHeight: '500px' }}>
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold">Legal Q&A Assistant</h3>
                <p className="text-sm text-gray-500">
                  {extractedText ? "Ask questions about your uploaded document" : "Upload a document to enable Q&A"}
                </p>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 h-full flex flex-col justify-center items-center">
                    <MessageCircle className="mx-auto w-12 h-12 text-gray-300 mb-2" />
                    <p className="mb-2">
                      {extractedText 
                        ? "Start a conversation about your legal document" 
                        : "Upload a document in the Upload section to enable Q&A features"}
                    </p>
                    {!extractedText && (
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Upload Document
                      </button>
                    )}
                  </div>
                ) : (
                  chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none max-w-xs lg:max-w-md">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="animate-spin h-4 w-4" />
                        <span>Analyzing document...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={
                      extractedText 
                        ? "Ask about termination clauses, liability terms..." 
                        : "Upload a document to enable Q&A"
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100"
                    disabled={!extractedText}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!extractedText || !inputMessage.trim() || isProcessing}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Quick Questions */}
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-900">Quick Questions</h4>
              </div>
              <div className="space-y-2">
                {[
                  "What are the termination conditions?",
                  "Are there any liability limitations?",
                  "What are the payment terms?",
                  "Is there a confidentiality clause?",
                  "What governing law applies?",
                  "Are there any renewal terms?"
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (extractedText) {
                        setInputMessage(question);
                        // Auto-scroll to input
                        setTimeout(() => {
                          document.querySelector('input[type="text"]')?.focus();
                        }, 100);
                      }
                    }}
                    disabled={!extractedText}
                    className={`w-full text-left text-sm p-2 rounded-lg transition-colors ${
                      extractedText 
                        ? 'text-blue-600 hover:bg-blue-50' 
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {question}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Document Info</h4>
                </div>
                {uploadedFile ? (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">File:</span> {uploadedFile.name}</p>
                    <p><span className="font-medium">Type:</span> {uploadedFile.type}</p>
                    <p><span className="font-medium">Size:</span> {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button
                      onClick={() => setActiveTab('analysis')}
                      className="mt-2 text-blue-600 text-sm hover:underline"
                    >
                      View full analysis →
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No document uploaded</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="text-center py-12">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
              <Eye className="mx-auto h-16 w-16 text-blue-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Document Comparison</h3>
              <p className="text-gray-500 mb-6">Compare two contracts side by side (Coming Soon)</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-blue-800 mb-2">Planned Features:</h4>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  <li>Side-by-side comparison of two legal documents</li>
                  <li>Highlight differences in clauses and terms</li>
                  <li>Risk assessment comparison</li>
                  <li>Export comparison reports</li>
                  <li>Version tracking over time</li>
                </ul>
              </div>
              
              <div className="mt-6 flex justify-center space-x-3">
                <button
                  onClick={() => setActiveTab('upload')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Documents
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Analysis
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <Scale className="w-6 h-6 text-blue-600" />
              <span className="font-medium">AI Legal Assistant</span>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-500">
              © {new Date().getFullYear()} Equinoxis LegalTech. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LegalAIAssistant;