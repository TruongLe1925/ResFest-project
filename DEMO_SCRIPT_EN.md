# University Admission Predictor - Demo Script
## Demo Page: http://localhost:5173/predict

---

## 1. Introduction (30 seconds)

**Script:**
> "Hello teacher, today I will demonstrate the core feature of our University Admission Prediction System. This is the Prediction page where students can input their academic scores and receive AI-powered admission probability analysis."

**Action:**
- Navigate to `http://localhost:5173/predict`
- Wait for page to fully load

---

## 2. Interface Overview (30 seconds)

**Script:**
> "The interface is divided into two main sections. On the left is the input form for academic metrics, and on the right is the result display area. This feature requires user login - I'm already logged in for this demo."

**Point out:**
- Page title: "The Clarified Path"
- "Academic Metrics" form panel (left side)
- "Prediction Result" placeholder card (right side)

---

## 3. Inputting Student Information (1 minute)

**Script:**
> "Now I'll demonstrate by entering information for a sample student applying to Vietnam National University, Ho Chi Minh City - University of Science."

### Step-by-Step Demo:

| Step | Action | Script |
|------|--------|--------|
| **Select University** | Click dropdown → Select "Vietnam National University, Ho Chi Minh City - University of Science" | "First, the student selects their target university. The system displays the previous year's cutoff score as a reference." |
| **Confirm Selection** | Click "Confirm" button | "After selecting, I click Confirm to lock the choice and load the available majors for this university." |
| **Select Major** | Major dropdown appears → Select "Computer Science" | "The system automatically loads all majors for this university. I'll select Computer Science." |
| **Enter Exam Score** | Input field "Exam score": Enter **26.5** | "The student's high school graduation exam score is 26.5 out of 30." |
| **Enter Transcript Score** | Input field "Transcript score": Enter **8.5** | "The student's average transcript GPA over 3 years is 8.5 out of 10." |

**Additional feature to mention:**
> "Students can also upload a transcript image, and the system will automatically extract the scores using OCR - I'll demonstrate that feature separately."

---

## 4. Running the Prediction (30 seconds)

**Script:**
> "After entering all the required information, I click the 'Predict Admission' button."

**Action:**
- Click the **"Predict Admission"** button
- Show loading spinner with "Predicting..." message
- Wait 2-3 seconds for AI processing
- Result appears on the right side

---

## 5. Explaining the Results (1 minute)

**Script:**
> "The AI prediction result is now displayed. As you can see:"

### Result Components:

| Component | Sample Value | Meaning |
|-----------|--------------|---------|
| **Probability** | **72%** | Admission chance percentage |
| **Status Badge** | **High** (green color) | High probability level |
| **Progress Bar** | Green bar at 72% | Visual representation |
| **AI Feedback** | *"Your scores are competitive compared to last year's cutoff. Your admission chance is very good."* | Overall assessment |
| **Strengths** | *"Strong exam performance, stable GPA"* | Student's advantages |
| **Weaknesses** | *"Prepare supporting documents carefully"* | Areas for improvement |
| **Details** | Target university, Cutoff score, Required transcript | Reference information |

**Conclusion:**
> "With a 72% probability, the AI evaluates this as 'High' status - indicating a very good chance of admission."

---

## 6. Alternative Scenario Demo (45 seconds)

**Script:**
> "Now let me demonstrate a different scenario - a student with lower scores applying to a more competitive university."

**Action:**
- Click **"New Prediction"** button to reset form
- Select: "Hanoi Medical University" (highly competitive)
- Enter Exam score: **22.0**
- Enter Transcript score: **7.5**
- Click **"Predict Admission"**

**Explain:**
> "With these scores, the AI predicts only 35% admission chance - marked as 'Low' status in red. The feedback will suggest alternative universities or majors that might be better suited for this student profile."

---

## 7. Conclusion (15 seconds)

**Script:**
> "This is our core prediction feature. Users can test multiple scenarios and compare admission chances across different universities to make informed decisions. Thank you for watching this demo."

---

## Technical Notes for Presenter

### Prerequisites:
1. **Backend running** on `localhost:8080`
2. **Ollama AI server** running with `qwen2.5` model
3. **Logged in** before accessing `/predict`
4. **Sample data** in database (universities, majors with cutoff scores)

### If AI is slow:
- Say: *"The AI is analyzing the student data..."* while waiting

### Sample data to prepare:
- Vietnam National University, HCM - University of Science (cutoff: ~25.0)
- Hanoi Medical University (cutoff: ~27.5)
- Computer Science, Information Technology majors

---

## Key Features Highlighted

✅ **Dual-score input** - Exam scores (0-30) and Transcript GPA (0-10)  
✅ **Smart major loading** - Dynamic dropdown based on selected university  
✅ **AI-powered prediction** - Natural language feedback with percentages  
✅ **Visual indicators** - Color-coded probability bars and status badges  
✅ **Actionable insights** - Specific strengths, weaknesses, and recommendations  
✅ **Transcript upload** - OCR-ready (mention as upcoming feature)  

---

*Demo Duration: ~4-5 minutes*
