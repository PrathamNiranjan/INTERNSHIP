import re
import json
import os

class DocumentProcessor:
    def __init__(self):
        # Simple processor without external AI dependencies
        self.llm = None
        
    def initialize_llm(self, model_path=None):
        """Initialize the local LLM. Currently using fallback methods."""
        print("⚠️  Using fallback methods for document processing")
        print("To enable full AI features, install LangChain and download a local LLM model")
        self.llm = MockLLM()
    
    def split_text(self, text):
        """Split text into chunks for processing"""
        # Simple text splitting
        chunk_size = 1000
        chunks = []
        for i in range(0, len(text), chunk_size):
            chunks.append(text[i:i + chunk_size])
        return chunks
    
    def extract_clauses(self, text):
        """Extract legal clauses from the document using regex patterns"""
        clauses = []
        
        # Define common legal clause patterns
        clause_patterns = [
            {
                'type': 'Termination',
                'pattern': r'(termination|terminate|end|cancel).*?(?=\n\n|\n[A-Z]|$)',
                'risk': 'medium'
            },
            {
                'type': 'Liability',
                'pattern': r'(liability|liable|damages|indemnification).*?(?=\n\n|\n[A-Z]|$)',
                'risk': 'high'
            },
            {
                'type': 'Payment',
                'pattern': r'(payment|pay|invoice|due|terms).*?(?=\n\n|\n[A-Z]|$)',
                'risk': 'low'
            },
            {
                'type': 'Confidentiality',
                'pattern': r'(confidential|confidentiality|secret|proprietary).*?(?=\n\n|\n[A-Z]|$)',
                'risk': 'medium'
            },
            {
                'type': 'Governing Law',
                'pattern': r'(governing law|jurisdiction|venue|applicable law).*?(?=\n\n|\n[A-Z]|$)',
                'risk': 'low'
            },
            {
                'type': 'Non-Compete',
                'pattern': r'(non.?compete|non.?competition|restrictive covenant).*?(?=\n\n|\n[A-Z]|$)',
                'risk': 'high'
            },
            {
                'type': 'Intellectual Property',
                'pattern': r'(intellectual property|ip|patent|copyright|trademark).*?(?=\n\n|\n[A-Z]|$)',
                'risk': 'medium'
            }
        ]
        
        for pattern_info in clause_patterns:
            matches = re.finditer(pattern_info['pattern'], text, re.IGNORECASE | re.DOTALL)
            for match in matches:
                content = match.group(0).strip()
                if len(content) > 20:  # Only include substantial clauses
                    clauses.append({
                        'type': pattern_info['type'],
                        'description': f"{pattern_info['type']} clause found in document",
                        'risk': pattern_info['risk'],
                        'content': content[:300] + '...' if len(content) > 300 else content,
                        'page': 1
                    })
        
        return clauses
    
    def summarize_document(self, text):
        """Generate a basic summary of the document"""
        summary_parts = []
        
        # Try to find document type
        doc_type = "legal document"
        if any(word in text.lower() for word in ['agreement', 'contract']):
            doc_type = "legal agreement or contract"
        elif 'employment' in text.lower():
            doc_type = "employment agreement"
        elif 'lease' in text.lower():
            doc_type = "lease agreement"
        
        summary_parts.append(f"This appears to be a {doc_type}.")
        
        # Count key terms
        key_terms = {
            'payment': text.lower().count('payment'),
            'termination': text.lower().count('termination'),
            'liability': text.lower().count('liability'),
            'confidentiality': text.lower().count('confidentiality'),
            'breach': text.lower().count('breach'),
            'damages': text.lower().count('damages')
        }
        
        summary_parts.append(f"Document contains {key_terms['payment']} payment-related terms, "
                           f"{key_terms['termination']} termination clauses, "
                           f"{key_terms['liability']} liability provisions, "
                           f"{key_terms['confidentiality']} confidentiality terms, "
                           f"{key_terms['breach']} breach clauses, and "
                           f"{key_terms['damages']} damages provisions.")
        
        # Estimate document length
        word_count = len(text.split())
        summary_parts.append(f"Document is approximately {word_count} words long.")
        
        # Add risk assessment
        high_risk_count = sum(1 for term in ['liability', 'breach', 'damages'] if key_terms[term] > 0)
        if high_risk_count > 0:
            summary_parts.append(f"Document contains {high_risk_count} high-risk elements that require careful review.")
        
        return " ".join(summary_parts)
    
    def analyze_risks(self, clauses):
        """Analyze and categorize risks from extracted clauses"""
        risk_counts = {'high': 0, 'medium': 0, 'low': 0}
        
        for clause in clauses:
            risk = clause.get('risk', 'low')
            if risk in risk_counts:
                risk_counts[risk] += 1
        
        risk_counts['total'] = len(clauses)
        
        return risk_counts

class MockLLM:
    """Mock LLM for development when no local model is available"""
    def __call__(self, prompt):
        return "Mock response - please install LangChain and a local LLM model for full functionality."

# Global processor instance
document_processor = DocumentProcessor()