# MEDIA PRODUCTION PIPELINE

Maintained by Lens (Media Producer).

This file defines the standard workflow for turning scripts into finished videos.

========================
PIPELINE STEPS
========================

## 1. Script Intake
**Input:** Script from Buzz (Chief Creative Officer - YouTube)
**Output:** Validated script ready for production
**Quality Check:** 
- Structure validation (intro, body, conclusion, call-to-action)
- Clarity assessment (clear messaging, logical flow)
- Timing estimation (target video length: 8-15 minutes)
- Visual cue identification (where B-roll/images needed)
**Tools:** 
- Script analysis templates
- Timing calculators
- Visual planning worksheets

## 2. Voiceover Generation
**Input:** Validated script
**Output:** Professional voiceover audio file
**Process:**
- **Voice Selection:** Choose from preset voice styles:
  - **Narrator:** Authoritative, clear (for educational content)
  - **Conversational:** Friendly, engaging (for vlog-style)
  - **Energetic:** Fast-paced, exciting (for promotional)
- **Audio Generation:** Use TTS tools (sag, ElevenLabs, or local)
- **Quality Control:**
  - Pace adjustment (150-180 words/minute)
  - Emotion injection at key points
  - Pause insertion for visual transitions
  - Volume normalization (-14 LUFS standard)
**File Format:** WAV 48kHz 24-bit (master), MP3 192kbps (working)

## 3. Visual Asset Generation
**Input:** Script with visual cues, voiceover audio
**Output:** Complete visual package ready for assembly
**Components:**

### A. B-Roll & Stock Footage
- **Source Selection:**
  - Stock libraries (Pexels, Pixabay, Storyblocks)
  - AI-generated video (Runway, Pika, etc.)
  - Screen recordings (for tutorials)
  - Original footage if available
- **Style Guidelines:**
  - Consistent color grading (LUT application)
  - Aspect ratio: 16:9 (YouTube standard)
  - Resolution: 4K preferred, 1080p minimum
  - Frame rate: 24fps (cinematic) or 30fps (standard)

### B. Images & Graphics
- **Types:**
  - Title cards, lower thirds, text overlays
  - Data visualizations, charts, graphs
  - Illustrations, diagrams, concept art
  - Memes, reaction images (for entertainment)
- **Creation Tools:**
  - AI image generation (DALL-E, Midjourney, Stable Diffusion)
  - Graphic design tools (Canva, Figma, Photoshop)
  - Chart generators (Google Sheets, Datawrapper)

### C. Motion Graphics & Effects
- **Standard Elements:**
  - Intro/outro animations (branded templates)
  - Transition effects (cuts, fades, wipes)
  - Text animations (title reveals, captions)
  - Visual effects (highlights, arrows, circles)
- **Templates:** Maintain library of reusable assets

## 4. Timeline Assembly
**Input:** Voiceover + Visual assets
**Output:** Edited video timeline ready for export
**Software:** DaVinci Resolve (primary), Premiere Pro (backup)
**Workflow:**

### A. Project Setup
- Create new project with standardized settings
- Import all assets to media pool
- Apply organizational structure (bins for audio, video, graphics)

### B. Audio Foundation
- Place voiceover on primary audio track
- Add background music (volume: -20dB under voice)
- Insert sound effects for emphasis
- Apply audio normalization and compression

### C. Visual Synchronization
- Match B-roll to voiceover content
- Ensure visual changes align with audio transitions
- Apply "cut on action" principles for smooth flow
- Add text/graphics to reinforce key points

### D. Pacing & Rhythm
- **Target Pace:** 1 visual change every 3-5 seconds
- **Attention Spans:** Major scene change every 60-90 seconds
- **Retention Hooks:** Strong visuals at 0:30, 2:00, 5:00 marks
- **Watch Time Optimization:** Front-load value, maintain engagement

### E. Quality Pass
- Color correction (apply LUTs, match shots)
- Audio mixing (balance levels, remove noise)
- Visual consistency check (fonts, colors, styles)
- Pacing review (remove dead air, tighten edits)

## 5. Export & Delivery
**Input:** Completed timeline
**Output:** Finished video ready for publishing
**Export Settings:**
- **Format:** MP4 H.264
- **Resolution:** 3840x2160 (4K) or 1920x1080 (HD)
- **Bitrate:** 35-45 Mbps (4K), 15-20 Mbps (HD)
- **Frame Rate:** Match source (24 or 30 fps)
- **Audio:** AAC 192kbps, -14 LUFS

**Delivery Process:**
1. Render final video to output directory
2. Create thumbnail (using template + custom elements)
3. Generate metadata file (title, description, tags, timestamps)
4. Notify Buzz and Lui of completion
5. Upload to YouTube (if automated pipeline enabled)
6. Archive project files for future edits

## 6. Post-Publication
**Input:** Published video
**Output:** Performance data and improvement insights
**Tracking:**
- Monitor initial 48-hour performance
- Track audience retention graphs
- Note click-through rate on thumbnail
- Collect comment sentiment
- Report findings to Buzz for content strategy refinement

========================
IMPROVEMENT LOG
========================

### 2026-04-09: Pipeline Established
- **Initial Creation:** Standard workflow defined
- **Tools Selected:** DaVinci Resolve primary, TTS integration planned
- **Quality Standards:** 4K target, professional audio levels
- **Next Improvements:** 
  1. Template library creation
  2. Automated asset generation integration
  3. Batch processing capabilities
  4. Performance analytics integration

### Future Upgrade Ideas:
1. **AI-Assisted Editing:** Automatic cut detection, pacing optimization
2. **Voice Cloning:** Custom voice model for brand consistency
3. **Asset Library:** Organized repository of reusable elements
4. **Automated Publishing:** Direct YouTube upload with metadata
5. **A/B Testing:** Thumbnail and title variant testing
6. **Collaboration Portal:** Buzz can review and comment on edits
7. **Performance Dashboard:** Real-time analytics on published content

## Pipeline Performance Metrics

### Efficiency Metrics:
- **Script-to-Video Time:** Target <24 hours for standard videos
- **Revision Cycles:** Average <2 rounds of feedback
- **Asset Reuse:** >30% of visuals from template library
- **Automation Rate:** % of steps that are automated vs manual

### Quality Metrics:
- **Audience Retention:** >60% average watch time
- **Production Quality:** Professional standards met (audio, visual, pacing)
- **Brand Consistency:** All videos maintain cohesive look/feel
- **Client Satisfaction:** Buzz approval rating (scale 1-10)

### Scalability Metrics:
- **Parallel Projects:** Number of videos in production simultaneously
- **Resource Utilization:** Efficient use of tools and assets
- **Learning Curve:** Time to train new team members on pipeline
- **Cost per Minute:** Production cost relative to video length

---
**Pipeline Created:** 2026-04-09
**Maintained by:** Lens (Media Producer)
**Next Review:** 2026-04-16
**Related Files:** PROJECT_BOARD.md (YouTube projects), Buzz skills (script creation)