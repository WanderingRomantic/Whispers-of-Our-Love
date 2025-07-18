from flask import render_template, request, redirect, url_for, flash
from app import app, db
from models import Comment

# Chapter data with poetic quotes
CHAPTERS = {
    1: {
        'title': 'Fragments of Our Love',
        'quote': 'We were a thousand pieces of a puzzle that never quite fit together, yet somehow made the most beautiful picture when scattered.'
    },
    2: {
        'title': 'The Memory That Refused to Fade',
        'quote': 'I memorized the way you looked at everything else, searching for the moment you would look at me the same way again.'
    },
    3: {
        'title': 'Life Lost It\'s Hue Without Her',
        'quote': 'My heart wrote you letters every day, but my hands never learned the courage to send them into your world.'
    },
    4: {
        'title': 'The Scent of Goodbye',
        'quote': 'You left like perfume on a winter breeze—intoxicating, lingering, and impossible to hold onto.'
    },
    5: {
        'title': 'The Silence Between Songs',
        'quote': 'We danced to music only we could hear, until the silence became louder than our love ever was.'
    },
    6: {
        'title': 'Empty Chairs and Echoes',
        'quote': 'I still set two plates for dinner, still save your side of the bed, still hear your laughter in empty rooms.'
    },
    7: {
        'title': 'Fading Photographs',
        'quote': 'Time steals the color from memories, but never the feeling—you remain vivid in my monochrome dreams.'
    },
    8: {
        'title': 'What We Almost Were',
        'quote': 'We lived in the space between almost and never, where love stories go to become beautiful tragedies.'
    },
    9: {
        'title': 'Moonlight Regrets',
        'quote': 'Under the same moon that witnessed our promises, I whisper apologies to the stars for letting you go.'
    },
    10: {
        'title': 'Whispers in the Wind',
        'quote': 'Even now, when the wind calls your name, I turn around hoping you might finally be there to answer.'
    }
}

@app.route('/')
def homepage():
    return render_template('homepage.html')

@app.route('/chapters')
def chapters():
    return render_template('chapters.html', chapters=CHAPTERS)

@app.route('/chapter/<int:chapter_id>')
def chapter(chapter_id):
    if chapter_id not in CHAPTERS:
        flash('Chapter not found.')
        return redirect(url_for('chapters'))
    
    # Only allow access to chapters 1-3
    if chapter_id > 3:
        flash('This chapter is currently locked. Only the first 3 chapters are available.')
        return redirect(url_for('chapters'))
    
    chapter_data = CHAPTERS[chapter_id]
    comments = Comment.query.filter_by(chapter_id=chapter_id).order_by(Comment.timestamp.desc()).all()
    
    # Navigation - only show next if it's accessible
    prev_chapter = chapter_id - 1 if chapter_id > 1 else None
    next_chapter = chapter_id + 1 if chapter_id < 3 else None
    
    return render_template('chapter.html', 
                         chapter_id=chapter_id,
                         chapter=chapter_data, 
                         comments=comments,
                         prev_chapter=prev_chapter,
                         next_chapter=next_chapter)

@app.route('/chapter/<int:chapter_id>/comment', methods=['POST'])
def add_comment(chapter_id):
    if chapter_id not in CHAPTERS:
        flash('Chapter not found.')
        return redirect(url_for('chapters'))
    
    name = request.form.get('name', '').strip()
    thought = request.form.get('thought', '').strip()
    
    if not name or not thought:
        flash('Please fill in both your name and thought.')
        return redirect(url_for('chapter', chapter_id=chapter_id))
    
    comment = Comment(chapter_id=chapter_id, name=name, thought=thought)
    db.session.add(comment)
    db.session.commit()
    
    flash('Your thought has been shared with other readers.')
    return redirect(url_for('chapter', chapter_id=chapter_id))
