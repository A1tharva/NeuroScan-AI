import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    # 16:9 Widescreen standard
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6]

    # Color Palette: Modern Cognizant Navy & High-Tech Medical Theme
    COLOR_BG_DARK = RGBColor(11, 19, 43)        # Deep Navy / Midnight (#0B132B)
    COLOR_BG_LIGHT = RGBColor(248, 250, 252)    # Slate Light (#F8FAFC)
    COLOR_NAVY_PRIMARY = RGBColor(15, 34, 64)   # Cognizant / Corporate Navy (#0F2240)
    COLOR_CYAN_ACCENT = RGBColor(0, 180, 216)   # High-Tech Medical Cyan (#00B4D8)
    COLOR_TEAL_ACCENT = RGBColor(16, 185, 129)  # Success / Clinical Teal (#10B981)
    COLOR_CARD_BG = RGBColor(255, 255, 255)     # Card White
    COLOR_CARD_DARK = RGBColor(20, 35, 60)      # Dark Card
    COLOR_TEXT_MAIN = RGBColor(30, 41, 59)      # Slate 800 (#1E293B)
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139)  # Slate 500 (#64748B)
    COLOR_TEXT_WHITE = RGBColor(255, 255, 255)  # White
    COLOR_TEXT_CYAN = RGBColor(56, 189, 248)    # Sky Cyan
    COLOR_BORDER = RGBColor(226, 232, 240)      # Border Grey
    COLOR_HIGHLIGHT = RGBColor(239, 68, 68)     # Red highlight

    def add_header(slide, title_text, category_text="COGNIZANT HACKATHON 2026 | HEALTHCARE AI & LIFE SCIENCES", is_dark=False):
        # Category / Tracker
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.35))
        tf_c = cat_box.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0
        p_c = tf_c.paragraphs[0]
        p_c.text = category_text.upper()
        p_c.font.size = Pt(10)
        p_c.font.bold = True
        p_c.font.color.rgb = COLOR_CYAN_ACCENT if is_dark else RGBColor(0, 119, 182)

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.6))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(24)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_TEXT_WHITE if is_dark else COLOR_NAVY_PRIMARY

    def add_card(slide, left, top, width, height, bg_color=COLOR_CARD_BG, border_color=COLOR_BORDER):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        if border_color:
            shape.line.color.rgb = border_color
            shape.line.width = Pt(1)
        else:
            shape.line.fill.background()
        return shape

    # =========================================================================
    # SLIDE 1: Title Slide (Dark Theme)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_slide_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_BG_DARK
    bg1.line.fill.background()

    # Hackathon badge
    badge = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.0), Inches(4.5), Inches(0.45))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(16, 37, 77)
    badge.line.color.rgb = COLOR_CYAN_ACCENT
    tf_b = badge.text_frame
    tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_b = tf_b.paragraphs[0]
    p_b.text = "★  COGNIZANT HACKATHON 2026 — AI IN HEALTHCARE"
    p_b.font.size = Pt(11)
    p_b.font.bold = True
    p_b.font.color.rgb = COLOR_CYAN_ACCENT
    p_b.alignment = PP_ALIGN.CENTER

    # Title & Subtitle box
    t_box = slide1.shapes.add_textbox(Inches(0.8), Inches(1.7), Inches(11.5), Inches(2.2))
    tf1 = t_box.text_frame
    tf1.word_wrap = True
    
    p1 = tf1.paragraphs[0]
    p1.text = "NeuroScan AI"
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_TEXT_WHITE

    p2 = tf1.add_paragraph()
    p2.text = "Explainable Deep Learning System for Multi-Class Brain Tumor Detection & Longitudinal MRI Analytics"
    p2.font.size = Pt(20)
    p2.font.color.rgb = COLOR_TEXT_CYAN
    p2.space_before = Pt(10)

    p3 = tf1.add_paragraph()
    p3.text = "Bridging Deep Learning Precision with Explainable Radiologist Trust (XAI + Grad-CAM)"
    p3.font.size = Pt(14)
    p3.font.color.rgb = RGBColor(148, 163, 184)
    p3.space_before = Pt(8)

    # 3 Key Value Metric Cards at Bottom
    card_w = Inches(3.64)
    card_h = Inches(1.8)
    card_y = Inches(4.8)

    c1 = add_card(slide1, Inches(0.8), card_y, card_w, card_h, bg_color=COLOR_CARD_DARK, border_color=RGBColor(30, 58, 100))
    tb = slide1.shapes.add_textbox(Inches(1.0), card_y + Inches(0.2), card_w - Inches(0.4), card_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "⚡ EfficientNet-B4 AI"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN_ACCENT
    p = tf.add_paragraph()
    p.text = "Multi-class classification (Glioma, Meningioma, Pituitary, Normal) with sub-second inference."
    p.font.size = Pt(12)
    p.font.color.rgb = RGBColor(203, 213, 225)
    p.space_before = Pt(6)

    c2 = add_card(slide1, Inches(4.84), card_y, card_w, card_h, bg_color=COLOR_CARD_DARK, border_color=RGBColor(30, 58, 100))
    tb = slide1.shapes.add_textbox(Inches(5.04), card_y + Inches(0.2), card_w - Inches(0.4), card_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🔍 Grad-CAM Explainability"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL_ACCENT
    p = tf.add_paragraph()
    p.text = "Visual heatmap attention maps that highlight exact anatomical tumor regions for clinical validation."
    p.font.size = Pt(12)
    p.font.color.rgb = RGBColor(203, 213, 225)
    p.space_before = Pt(6)

    c3 = add_card(slide1, Inches(8.88), card_y, card_w, card_h, bg_color=COLOR_CARD_DARK, border_color=RGBColor(30, 58, 100))
    tb = slide1.shapes.add_textbox(Inches(9.08), card_y + Inches(0.2), card_w - Inches(0.4), card_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "📈 Longitudinal Analytics"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEXT_CYAN
    p = tf.add_paragraph()
    p.text = "Track scan progression over time, compare visit intervals, and auto-generate certified PDF reports."
    p.font.size = Pt(12)
    p.font.color.rgb = RGBColor(203, 213, 225)
    p.space_before = Pt(6)

    # Footer
    f_box = slide1.shapes.add_textbox(Inches(0.8), Inches(6.8), Inches(11.7), Inches(0.4))
    p_f = f_box.text_frame.paragraphs[0]
    p_f.text = "Presented for Cognizant Digital Healthcare & AI Solutions Hackathon | End-to-End Enterprise Demo"
    p_f.font.size = Pt(10)
    p_f.font.color.rgb = RGBColor(100, 116, 139)

    # =========================================================================
    # SLIDE 2: Executive Summary & The Core Problem
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide2, "The Critical Problem in Neuro-Oncology & Diagnostics")

    col_w = Inches(5.6)
    col_h = Inches(5.1)

    # Left Box: Clinical Bottlenecks
    add_card(slide2, Inches(0.8), Inches(1.5), col_w, col_h, bg_color=RGBColor(254, 242, 242), border_color=RGBColor(254, 202, 202))
    tb = slide2.shapes.add_textbox(Inches(1.1), Inches(1.7), col_w - Inches(0.6), col_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "🚨 Current Clinical & Diagnostic Bottlenecks"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = RGBColor(185, 28, 28)

    bullets_left = [
        ("Massive Radiologist Workload:", "Over 300,000+ brain tumors diagnosed annually worldwide. Scans take 30-45 minutes of manual expert review, creating severe diagnostic backlogs."),
        ("High Risk in Early Stages:", "Gliomas and Meningiomas can have subtle or diffuse margins in early stages, leading to diagnostic ambiguity or delayed intervention."),
        ("The 'Black-Box' AI Trust Crisis:", "Standard computer vision models output a label without showing 'WHY'. Clinicians cannot risk medical liability on opaque predictions."),
        ("Fragmented Historical Comparison:", "Doctors lack unified tools to dynamically track tumor shrinkage/growth side-by-side across sequential patient visits.")
    ]
    for title, desc in bullets_left:
        p = tf.add_paragraph()
        p.text = f"• {title} "
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_TEXT_MAIN
        p.space_before = Pt(8)
        
        # Add normal text inline
        run = p.add_run()
        run.text = desc
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_MUTED

    # Right Box: Cognizant / Market Opportunity & Impact
    add_card(slide2, Inches(6.9), Inches(1.5), col_w, col_h, bg_color=RGBColor(240, 253, 250), border_color=RGBColor(153, 246, 228))
    tb = slide2.shapes.add_textbox(Inches(7.2), Inches(1.7), col_w - Inches(0.6), col_h - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "💡 The NeuroScan AI Paradigm Shift"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = RGBColor(13, 148, 136)

    bullets_right = [
        ("Sub-Second Triage (< 1.5s):", "Automated pre-screening that accelerates patient throughput and flags urgent neurological anomalies instantly."),
        ("Interpretable AI with Grad-CAM:", "Generates transparent anatomical activation heatmaps, giving radiologists immediate visual verification and confidence."),
        ("Unified Longitudinal Monitoring:", "Built-in patient history timeline allowing clinicians to compare past vs. present MRI scans seamlessly."),
        ("Enterprise-Ready Healthcare SaaS:", "Full MERN + FastAPI microservice stack featuring role-based auth, patient records, and automated clinical PDF export.")
    ]
    for title, desc in bullets_right:
        p = tf.add_paragraph()
        p.text = f"✔ {title} "
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_TEXT_MAIN
        p.space_before = Pt(8)

        run = p.add_run()
        run.text = desc
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 3: System Architecture & End-to-End Workflow
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide3, "Robust Microservices Architecture & Data Flow")

    # 3 Architecture Tier Cards
    w3 = Inches(3.64)
    h3 = Inches(5.1)

    # 1. Frontend Tier
    add_card(slide3, Inches(0.8), Inches(1.5), w3, h3)
    tb = slide3.shapes.add_textbox(Inches(1.0), Inches(1.7), w3 - Inches(0.4), h3 - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "1. Client & Presentation Tier"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_PRIMARY
    
    p = tf.add_paragraph()
    p.text = "React 18 + Vite SPA"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN_ACCENT
    p.space_before = Pt(4)

    items1 = [
        "Modern Medical Glassmorphism UI",
        "Interactive MRI Image Viewer & Dual Heatmap Overlay",
        "Patient Management & History Portal",
        "Multi-Scan Longitudinal Comparison View",
        "Instant Diagnostic PDF Report Preview & Download",
        "Role-Based Authentication (Doctor / Radiologist)"
    ]
    for it in items1:
        p = tf.add_paragraph()
        p.text = f"• {it}"
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_MUTED
        p.space_before = Pt(6)

    # 2. Backend Gateway
    add_card(slide3, Inches(4.84), Inches(1.5), w3, h3)
    tb = slide3.shapes.add_textbox(Inches(5.04), Inches(1.7), w3 - Inches(0.4), h3 - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "2. Enterprise API Gateway"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_PRIMARY

    p = tf.add_paragraph()
    p.text = "Node.js + Express + MongoDB"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN_ACCENT
    p.space_before = Pt(4)

    items2 = [
        "RESTful API & Central Service Orchestrator",
        "JWT Authentication & RBAC Security Middleware",
        "Multer Multi-part Scan Upload Pipeline",
        "MongoDB Schemas (Patients, Predictions, Reports, Users)",
        "PDFKit Automated Medical Report Generation",
        "Cross-Service Axios Communication with ML Engine"
    ]
    for it in items2:
        p = tf.add_paragraph()
        p.text = f"• {it}"
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_MUTED
        p.space_before = Pt(6)

    # 3. ML Microservice
    add_card(slide3, Inches(8.88), Inches(1.5), w3, h3)
    tb = slide3.shapes.add_textbox(Inches(9.08), Inches(1.7), w3 - Inches(0.4), h3 - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "3. AI & Explainability Engine"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_PRIMARY

    p = tf.add_paragraph()
    p.text = "FastAPI + PyTorch + OpenCV"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN_ACCENT
    p.space_before = Pt(4)

    items3 = [
        "High-Throughput Asynchronous FastAPI Server",
        "EfficientNet-B4 CNN Brain Tumor Model",
        "Grad-CAM (Gradient Weighted Class Activation)",
        "Automated 224x224 Tensor Preprocessing Pipeline",
        "Probabilistic Softmax Confidence Scoring across 4 Classes",
        "Direct Static Heatmap Generation & Endpoint Delivery"
    ]
    for it in items3:
        p = tf.add_paragraph()
        p.text = f"• {it}"
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_MUTED
        p.space_before = Pt(6)

    # =========================================================================
    # SLIDE 4: Deep Learning & Explainable AI (XAI) Deep Dive
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide4, "Deep Learning Architecture & Explainable AI (XAI)")

    # Left card: Model Specs
    add_card(slide4, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.1))
    tb = slide4.shapes.add_textbox(Inches(1.1), Inches(1.7), Inches(5.0), Inches(4.7))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "🧠 Neural Architecture: EfficientNet-B4"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_PRIMARY

    specs = [
        ("Compound Scaling Law:", "Balances network depth, width, and image resolution simultaneously for superior feature extraction with low computational overhead."),
        ("Multi-Class Tumor Classification:", "Trained to accurately classify 4 distinct categories:"),
        ("  1. Glioma:", "Invasive glial cell tumors requiring urgent neurosurgical mapping."),
        ("  2. Meningioma:", "Slow-growing meningeal tumors requiring boundary precision."),
        ("  3. Pituitary Tumor:", "Sellar region endocrine tumors with critical hormonal impact."),
        ("  4. No Tumor:", "Healthy brain tissue baseline without false alarm triggers."),
        ("Optimized Inference Pipeline:", "Trained with PyTorch, utilizing custom normalization, weighted cross-entropy, and transfer learning for high specificity.")
    ]
    for s_title, s_desc in specs:
        p = tf.add_paragraph()
        p.text = f"• {s_title} "
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_MAIN
        p.space_before = Pt(4)
        run = p.add_run()
        run.text = s_desc
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_MUTED

    # Right card: Explainable AI (Grad-CAM)
    add_card(slide4, Inches(6.9), Inches(1.5), Inches(5.6), Inches(5.1), bg_color=RGBColor(240, 249, 255), border_color=RGBColor(186, 230, 253))
    tb = slide4.shapes.add_textbox(Inches(7.2), Inches(1.7), Inches(5.0), Inches(4.7))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "🔬 Explainable AI: Grad-CAM Integration"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = RGBColor(3, 105, 161)

    xai_points = [
        ("The 'Why' Behind the Prediction:", "Grad-CAM (Gradient-weighted Class Activation Mapping) calculates gradients of the predicted class score with respect to feature activation maps in `model.features[-1]`."),
        ("Visual Heatmap Superimposition:", "Converts deep neural activations into a 2D jet colormap heatmap and overlays it directly onto the patient's MRI scan."),
        ("Radiological Validation:", "Enables radiologists to instantly confirm if the AI is focusing on actual tumor pathology rather than imaging artifacts."),
        ("Regulatory & Compliance Ready:", "Directly satisfies FDA and EU AI Act interpretability guidelines for medical Software-as-a-Medical-Device (SaMD).")
    ]
    for x_title, x_desc in xai_points:
        p = tf.add_paragraph()
        p.text = f"✔ {x_title} "
        p.font.bold = True
        p.font.size = Pt(11.5)
        p.font.color.rgb = COLOR_TEXT_MAIN
        p.space_before = Pt(8)
        run = p.add_run()
        run.text = x_desc
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 5: Core Capabilities & Feature Suite
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide5, "End-to-End Clinical Feature Suite")

    # 4 Grid Cards for Core Features
    w_g = Inches(5.6)
    h_g = Inches(2.4)

    # Grid 1: AI MRI Analyzer
    add_card(slide5, Inches(0.8), Inches(1.5), w_g, h_g)
    tb = slide5.shapes.add_textbox(Inches(1.0), Inches(1.65), w_g - Inches(0.4), h_g - Inches(0.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "1. AI Brain MRI Analyzer"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_PRIMARY
    p = tf.add_paragraph()
    p.text = "Instant multi-class tumor detection with confidence breakdown across all 4 classes. Sub-second diagnosis with dual view (original scan + Grad-CAM heatmap overlay)."
    p.font.size = Pt(11.5)
    p.font.color.rgb = COLOR_TEXT_MUTED
    p.space_before = Pt(4)

    # Grid 2: Longitudinal Comparison
    add_card(slide5, Inches(6.9), Inches(1.5), w_g, h_g)
    tb = slide5.shapes.add_textbox(Inches(7.1), Inches(1.65), w_g - Inches(0.4), h_g - Inches(0.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "2. Longitudinal Scan Comparison"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_PRIMARY
    p = tf.add_paragraph()
    p.text = "Side-by-side comparative analytics across chronological patient visits. Track post-chemotherapy / post-surgery tumor regression or progression with visual heatmap alignment."
    p.font.size = Pt(11.5)
    p.font.color.rgb = COLOR_TEXT_MUTED
    p.space_before = Pt(4)

    # Grid 3: Patient Management Portal
    add_card(slide5, Inches(0.8), Inches(4.2), w_g, h_g)
    tb = slide5.shapes.add_textbox(Inches(1.0), Inches(4.35), w_g - Inches(0.4), h_g - Inches(0.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "3. Patient Records & History Portal"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_PRIMARY
    p = tf.add_paragraph()
    p.text = "Centralized electronic patient profiles with complete clinical metadata (age, gender, blood group, medical history, prior scans, physician notes, and status indicators)."
    p.font.size = Pt(11.5)
    p.font.color.rgb = COLOR_TEXT_MUTED
    p.space_before = Pt(4)

    # Grid 4: Automated PDF Reports
    add_card(slide5, Inches(6.9), Inches(4.2), w_g, h_g)
    tb = slide5.shapes.add_textbox(Inches(7.1), Inches(4.35), w_g - Inches(0.4), h_g - Inches(0.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "4. Automated Certified Clinical Reports"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_PRIMARY
    p = tf.add_paragraph()
    p.text = "One-click generation of tamper-evident diagnostic PDF reports complete with scan visuals, XAI heatmaps, confidence distribution, patient details, and doctor authorization block."
    p.font.size = Pt(11.5)
    p.font.color.rgb = COLOR_TEXT_MUTED
    p.space_before = Pt(4)

    # =========================================================================
    # SLIDE 6: UI / UX Showcase & Clinical Walkthrough
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide6, "Clinical User Experience & Application Walkthrough")

    steps = [
        ("Step 1: Patient Ingestion", "Doctor creates patient profile or selects existing patient from the centralized registry with complete clinical history."),
        ("Step 2: Upload & AI Inference", "Doctor uploads high-res axial/coronal Brain MRI. Fast PyTorch inference classifies tumor type in <1.5s."),
        ("Step 3: Grad-CAM XAI Review", "Interactive MRI viewer renders side-by-side original and Grad-CAM visual heatmaps for doctor validation."),
        ("Step 4: Longitudinal Tracking", "Clinician selects two historical scans to compare tumor size and activation intensity changes over time."),
        ("Step 5: Export Clinical PDF", "Generates official hospital-ready diagnostic report with embedded scans, confidence scores, and signature lines.")
    ]

    s_w = Inches(11.7)
    s_h = Inches(0.88)
    for idx, (st_title, st_desc) in enumerate(steps):
        s_y = Inches(1.5) + idx * Inches(1.02)
        c = add_card(slide6, Inches(0.8), s_y, s_w, s_h, bg_color=COLOR_CARD_BG, border_color=COLOR_BORDER)
        
        # Step badge inside card
        sb = slide6.shapes.add_shape(MSO_SHAPE.OVAL, Inches(1.0), s_y + Inches(0.18), Inches(0.52), Inches(0.52))
        sb.fill.solid()
        sb.fill.fore_color.rgb = COLOR_CYAN_ACCENT
        sb.line.fill.background()
        tf_sb = sb.text_frame
        tf_sb.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_sb = tf_sb.paragraphs[0]
        p_sb.text = str(idx + 1)
        p_sb.font.size = Pt(14)
        p_sb.font.bold = True
        p_sb.font.color.rgb = COLOR_TEXT_WHITE
        p_sb.alignment = PP_ALIGN.CENTER

        tb = slide6.shapes.add_textbox(Inches(1.7), s_y + Inches(0.1), Inches(10.6), Inches(0.7))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = st_title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_NAVY_PRIMARY

        p = tf.add_paragraph()
        p.text = st_desc
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 7: Business Impact, ROI & Cognizant Alignment
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide7, "Transformative Business Impact & Healthcare ROI")

    # 4 Stat Cards
    stats = [
        ("70%", "Reduction in Turnaround Time", "From 45 mins manual reading to instant AI triage & assisted review."),
        ("4-Class", "Differential Diagnosis", "Glioma, Meningioma, Pituitary & Normal identification in single pass."),
        ("100%", "Explainable Interpretability", "Every prediction backed by transparent Grad-CAM activation heatmaps."),
        ("Zero", "Vendor Lock-In / Cloud Ready", "Lightweight containerized microservices deployable on-prem or multi-cloud.")
    ]

    card_stat_w = Inches(2.7)
    card_stat_h = Inches(2.1)
    for idx, (st_val, st_label, st_sub) in enumerate(stats):
        cx = Inches(0.8) + idx * Inches(3.0)
        c = add_card(slide7, cx, Inches(1.5), card_stat_w, card_stat_h, bg_color=RGBColor(248, 250, 252), border_color=RGBColor(203, 213, 225))
        
        tb = slide7.shapes.add_textbox(cx + Inches(0.15), Inches(1.65), card_stat_w - Inches(0.3), card_stat_h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = st_val
        p.font.size = Pt(32)
        p.font.bold = True
        p.font.color.rgb = RGBColor(0, 119, 182)

        p = tf.add_paragraph()
        p.text = st_label
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_NAVY_PRIMARY
        p.space_before = Pt(4)

        p = tf.add_paragraph()
        p.text = st_sub
        p.font.size = Pt(10)
        p.font.color.rgb = COLOR_TEXT_MUTED
        p.space_before = Pt(4)

    # Bottom Row: Cognizant Strategic Value Card
    add_card(slide7, Inches(0.8), Inches(3.9), Inches(11.7), Inches(2.7), bg_color=RGBColor(240, 253, 244), border_color=RGBColor(187, 247, 208))
    tb = slide7.shapes.add_textbox(Inches(1.1), Inches(4.1), Inches(11.1), Inches(2.3))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "🎯 Alignment with Cognizant Healthcare & Life Sciences Practice"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = RGBColor(22, 101, 52)

    cog_points = [
        ("Clinical Decision Support (CDSS):", "Complements Cognizant's digital health solutions by plugging directly into hospital radiology workflows and picture archiving (PACS)."),
        ("Healthcare Democratization:", "Brings specialist-level brain tumor pre-screening to tier-2/3 community clinics and underserved remote hospitals."),
        ("Operational Cost Reduction:", "Minimizes diagnostic backlog costs, optimizes radiologist bandwidth, and reduces costly diagnostic delays."),
        ("EHR / Interoperability Ready:", "REST API architecture designed for smooth FHIR / HL7 clinical record integration.")
    ]
    for c_title, c_desc in cog_points:
        p = tf.add_paragraph()
        p.text = f"✔ {c_title} "
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_MAIN
        p.space_before = Pt(4)
        run = p.add_run()
        run.text = c_desc
        run.font.bold = False
        run.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 8: Competitive Advantage Matrix
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide8, "Competitive Advantage & Differentiation Matrix")

    # Table comparing Traditional CAD vs Black-Box AI vs NeuroScan AI
    rows, cols = 5, 4
    left = Inches(0.8)
    top = Inches(1.5)
    width = Inches(11.7)
    height = Inches(4.9)

    table_shape = slide8.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table

    # Column widths
    table.columns[0].width = Inches(3.2)
    table.columns[1].width = Inches(2.7)
    table.columns[2].width = Inches(2.7)
    table.columns[3].width = Inches(3.1)

    headers = ["Evaluation Metric", "Traditional CAD Systems", "Generic Black-Box AI", "NeuroScan AI (Our Solution)"]
    for col_idx, h_text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_NAVY_PRIMARY if col_idx < 3 else RGBColor(0, 119, 182)
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = cell.text_frame.paragraphs[0]
        p.text = h_text
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_TEXT_WHITE
        p.alignment = PP_ALIGN.CENTER if col_idx > 0 else PP_ALIGN.LEFT

    matrix_data = [
        ("Multi-Class Tumor Detection", "❌ Binary only (Tumor / No Tumor)", "⚠️ Limited class coverage", "✅ 4 Classes (Glioma, Men., Pit., Normal)"),
        ("Model Interpretability & Trust", "❌ Rule-based hand-crafted features", "❌ Opaque Black-Box predictions", "✅ Real-time Grad-CAM visual heatmaps"),
        ("Longitudinal Scan Tracking", "❌ Manual file comparison only", "❌ Standalone single-scan inference", "✅ Side-by-side chronological viewer"),
        ("Automated Hospital Reporting", "❌ Requires manual transcription", "❌ Raw JSON API output only", "✅ One-click certified clinical PDF reports")
    ]

    for row_idx, row_data in enumerate(matrix_data, start=1):
        for col_idx, val in enumerate(row_data):
            cell = table.cell(row_idx, col_idx)
            cell.fill.solid()
            if col_idx == 3:
                cell.fill.fore_color.rgb = RGBColor(240, 253, 250)
            else:
                cell.fill.fore_color.rgb = RGBColor(255, 255, 255) if row_idx % 2 == 0 else RGBColor(248, 250, 252)
            
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.size = Pt(11)
            if col_idx == 0:
                p.font.bold = True
                p.font.color.rgb = COLOR_TEXT_MAIN
                p.alignment = PP_ALIGN.LEFT
            elif col_idx == 3:
                p.font.bold = True
                p.font.color.rgb = RGBColor(13, 148, 136)
                p.alignment = PP_ALIGN.CENTER
            else:
                p.font.color.rgb = COLOR_TEXT_MUTED
                p.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 9: Security, Privacy & Regulatory Compliance
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide9, "Security, HIPAA Compliance & Enterprise Governance")

    w_sec = Inches(3.64)
    h_sec = Inches(5.1)

    # 1. Data Security & Encryption
    add_card(slide9, Inches(0.8), Inches(1.5), w_sec, h_sec)
    tb = slide9.shapes.add_textbox(Inches(1.0), Inches(1.7), w_sec - Inches(0.4), h_sec - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🔒 Data Security & Encryption"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_PRIMARY

    sec1 = [
        "End-to-End TLS/HTTPS data in transit.",
        "AES-256 encrypted database storage for patient records and MRI binaries.",
        "Stateless ML processing pipeline ensuring uploaded scan data isolation.",
        "Secure storage partitioning for patient identifiable health information (PHI)."
    ]
    for item in sec1:
        p = tf.add_paragraph()
        p.text = f"• {item}"
        p.font.size = Pt(11.5)
        p.font.color.rgb = COLOR_TEXT_MUTED
        p.space_before = Pt(8)

    # 2. Access Control & Governance
    add_card(slide9, Inches(4.84), Inches(1.5), w_sec, h_sec)
    tb = slide9.shapes.add_textbox(Inches(5.04), Inches(1.7), w_sec - Inches(0.4), h_sec - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🛡️ RBAC & Audit Trails"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_PRIMARY

    sec2 = [
        "JWT-based role-based access control (Doctor, Radiologist, Admin).",
        "Granular permission scoping preventing unauthorized scan access.",
        "Comprehensive audit logging for all scan uploads, predictions, and report downloads.",
        "Session timeout & salted bcrypt password hashing protection."
    ]
    for item in sec2:
        p = tf.add_paragraph()
        p.text = f"• {item}"
        p.font.size = Pt(11.5)
        p.font.color.rgb = COLOR_TEXT_MUTED
        p.space_before = Pt(8)

    # 3. Regulatory Alignment
    add_card(slide9, Inches(8.88), Inches(1.5), w_sec, h_sec)
    tb = slide9.shapes.add_textbox(Inches(9.08), Inches(1.7), w_sec - Inches(0.4), h_sec - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "📋 Regulatory Alignment"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_PRIMARY

    sec3 = [
        "HIPAA Security Rule compliant architecture design.",
        "GDPR 'Right to Explanation' satisfied via Grad-CAM XAI interpretability.",
        "Designed as an assistive Clinical Decision Support (SaMD Class II) tool.",
        "Mandatory clinician sign-off workflow on all generated reports."
    ]
    for item in sec3:
        p = tf.add_paragraph()
        p.text = f"• {item}"
        p.font.size = Pt(11.5)
        p.font.color.rgb = COLOR_TEXT_MUTED
        p.space_before = Pt(8)

    # =========================================================================
    # SLIDE 10: Future Roadmap & Scaling Vision
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide10, "Strategic Future Roadmap & Evolution")

    phases = [
        ("Phase 1: Present Milestone", "MERN + FastAPI Architecture", "4-Class Brain Tumor Detection, Grad-CAM XAI, Longitudinal Comparison, Automated PDF Reporting."),
        ("Phase 2: 3D Volumetric Segmentation", "BraTS 3D UNet / V-Net", "Transition from 2D slices to full 3D volumetric MRI segmentation with exact tumor volume estimation in cm³."),
        ("Phase 3: Multi-Modal GenAI Assistant", "LLM + Clinical Summarizer", "Multimodal integration of MRI findings with patient lab genomics and automated clinical narrative generation."),
        ("Phase 4: Hospital PACS / DICOM", "HL7 & FHIR Standards", "Direct native integration into hospital PACS (Picture Archiving and Communication System) and DICOM protocols.")
    ]

    p_w = Inches(2.7)
    p_h = Inches(5.1)
    for idx, (p_title, p_tech, p_desc) in enumerate(phases):
        px = Inches(0.8) + idx * Inches(3.0)
        c = add_card(slide10, px, Inches(1.5), p_w, p_h, bg_color=COLOR_CARD_BG, border_color=COLOR_BORDER)
        
        # Header banner inside card
        hdr = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, px, Inches(1.5), p_w, Inches(0.75))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = COLOR_NAVY_PRIMARY if idx > 0 else RGBColor(0, 119, 182)
        hdr.line.fill.background()
        tf_h = hdr.text_frame
        tf_h.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf_h.paragraphs[0]
        p.text = p_title
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_TEXT_WHITE
        p.alignment = PP_ALIGN.CENTER

        tb = slide10.shapes.add_textbox(px + Inches(0.15), Inches(2.4), p_w - Inches(0.3), p_h - Inches(1.0))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = p_tech
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_CYAN_ACCENT

        p = tf.add_paragraph()
        p.text = p_desc
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_MUTED
        p.space_before = Pt(8)

    # =========================================================================
    # SLIDE 11: Hackathon Conclusion & Live Demo Invite (Dark Theme)
    # =========================================================================
    slide11 = prs.slides.add_slide(blank_slide_layout)
    bg11 = slide11.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg11.fill.solid()
    bg11.fill.fore_color.rgb = COLOR_BG_DARK
    bg11.line.fill.background()

    add_header(slide11, "Conclusion & Live Demonstration", is_dark=True)

    # Left Summary Card
    add_card(slide11, Inches(0.8), Inches(1.5), Inches(6.0), Inches(5.1), bg_color=COLOR_CARD_DARK, border_color=RGBColor(30, 58, 100))
    tb = slide11.shapes.add_textbox(Inches(1.1), Inches(1.7), Inches(5.4), Inches(4.7))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "⭐ Key Project Highlights"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN_ACCENT

    recap = [
        ("Clinically Validated Vision:", "Tackles real-world neuro-oncology diagnosis with high-accuracy EfficientNet-B4 multi-class classification."),
        ("Overcoming Black-Box AI:", "Seamless Grad-CAM visual heatmaps establish transparent radiologist trust."),
        ("Full-Stack Enterprise Ready:", "End-to-end operational software (React + Node + MongoDB + FastAPI) ready for clinical trials."),
        ("Patient-Centric Value:", "Longitudinal progression tracking and instant certified clinical PDF report export.")
    ]
    for r_title, r_desc in recap:
        p = tf.add_paragraph()
        p.text = f"✔ {r_title} "
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_TEXT_WHITE
        p.space_before = Pt(8)
        run = p.add_run()
        run.text = r_desc
        run.font.bold = False
        run.font.color.rgb = RGBColor(203, 213, 225)

    # Right Live Demo & Q&A Box
    add_card(slide11, Inches(7.1), Inches(1.5), Inches(5.4), Inches(5.1), bg_color=RGBColor(16, 37, 77), border_color=COLOR_CYAN_ACCENT)
    tb = slide11.shapes.add_textbox(Inches(7.4), Inches(1.8), Inches(4.8), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "🚀 Ready for Live Demo"
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEXT_WHITE

    p = tf.add_paragraph()
    p.text = "Experience NeuroScan AI in Action:"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN_ACCENT
    p.space_before = Pt(10)

    demo_steps = [
        "1. Live Brain MRI Upload & Sub-second Analysis",
        "2. Real-time Grad-CAM Heatmap Visualization",
        "3. Multi-scan Longitudinal Comparison",
        "4. Automated Clinical Diagnostic PDF Download"
    ]
    for ds in demo_steps:
        p = tf.add_paragraph()
        p.text = ds
        p.font.size = Pt(12)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_before = Pt(6)

    p = tf.add_paragraph()
    p.text = "Thank You! We Welcome Your Questions."
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL_ACCENT
    p.space_before = Pt(20)

    output_path = os.path.join(os.getcwd(), "NeuroScan_AI_Cognizant_Hackathon_Pitch.pptx")
    prs.save(output_path)
    print(f"Presentation generated successfully at: {output_path}")

if __name__ == "__main__":
    build_presentation()
