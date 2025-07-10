from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import fitz  # PyMuPDF
from docx import Document
from ai_processor import document_processor

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def extract_text(file_path):
    if file_path.endswith('.pdf'):
        text = ""
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
        return text
    elif file_path.endswith('.docx'):
        doc = Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    elif file_path.endswith('.txt'):
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    else:
        return "Unsupported file format"

@app.route('/upload', methods=['POST'])
def upload_and_extract():
    print("Received upload request.")
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file provided"}), 400
    
    filename = file.filename
    if not filename:
        return jsonify({"error": "Invalid filename"}), 400
    
    print(f"Uploaded file: {filename}")
    
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    print(f"Saved to: {file_path}")
    
    try:
        # Extract text from document
        extracted_text = extract_text(file_path)
        print(f"Text extraction done. Length: {len(extracted_text)}")
        
        # Process with AI
        print("Starting AI processing...")
        
        # Generate document summary
        summary = document_processor.summarize_document(extracted_text)
        print("Summary generated")
        
        # Extract clauses
        clauses = document_processor.extract_clauses(extracted_text)
        print(f"Extracted {len(clauses)} clauses")
        
        # Analyze risks
        risk_stats = document_processor.analyze_risks(clauses)
        print("Risk analysis completed")
        
        # Prepare response
        analysis_results = {
            "summary": summary,
            "clauses": clauses,
            "risks": risk_stats,
            "processed": True,
            "filename": filename,
            "text_length": len(extracted_text)
        }
        
        return jsonify({
            "message": "File uploaded and processed successfully",
            "analysis": analysis_results
        })
        
    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat_with_document():
    """Handle chat queries about the uploaded document"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        question = data.get('question', '')
        document_text = data.get('document_text', '')
        
        if not question or not document_text:
            return jsonify({"error": "Question and document text are required"}), 400
        
        # Create a simple Q&A prompt
        qa_prompt = f"""
        Based on the following legal document, answer this question: {question}
        
        Document text:
        {document_text[:2000]}  # Limit text length
        
        Answer:
        """
        
        # For now, return a mock response
        # In a full implementation, you would use the LLM here
        response = f"Based on your document analysis, here's what I found regarding '{question}': The document contains relevant information that addresses your query. For more detailed analysis, please ensure you have a local LLM model configured."
        
        return jsonify({
            "response": response,
            "question": question
        })
        
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "ai_processor": "initialized"})

if __name__ == '__main__':
    # Initialize the AI processor
    print("Initializing AI Document Processor...")
    document_processor.initialize_llm()
    print("AI Processor initialized successfully")
    
    app.run(debug=True, port=5000)
