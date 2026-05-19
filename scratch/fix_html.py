file_path = r'c:\Users\Sadguru\OneDrive\Desktop\portfolio\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find the start index of the about-visual div
start_marker = '<div class="about-visual slide-in-right">'
start_idx = content.find(start_marker)

if start_idx == -1:
    print("Start marker not found!")
    exit(1)

# Let's find the end of this div block by looking for the next section title or experience section
end_marker = '<!-- Timeline Item 1 -->'
# Actually, the skills marquee or section follows right after about. Let's find '<div class="skills">'
end_marker = '<div class="skills">'
end_idx = content.find(end_marker)

if end_idx == -1:
    print("End marker not found!")
    exit(1)

# Let's find the closing section/div right before '<div class="skills">'
# We want to replace from start_idx up to the point right before '<div class="skills">'
about_visual_block = content[start_idx:end_idx]
print("FOUND ABOUT-VISUAL BLOCK:")
print(repr(about_visual_block[:200]) + " ... " + repr(about_visual_block[-200:]))

# Let's define the new clean about-visual content
new_about_visual = """<div class="about-visual slide-in-right">
                        <div class="code-animation">
                            <div class="code-line">class DeveloperProfile:</div>
                            <div class="code-line indent">def __init__(self):</div>
                            <div class="code-line indent2">self.name = "Soujanya S P"</div>
                            <div class="code-line indent2">self.roles = [</div>
                            <div class="code-line indent3">"AI Engineer",</div>
                            <div class="code-line indent3">"Data Scientist",</div>
                            <div class="code-line indent3">"Generative AI Developer",</div>
                            <div class="code-line indent3">"Python Developer"</div>
                            <div class="code-line indent2">]</div>
                            <div class="code-line indent2">self.skills = {</div>
                            <div class="code-line indent3">"languages": ["Python", "SQL"],</div>
                            <div class="code-line indent3">"ai_stack": ["LLMs", "RAG", "LangChain", "Multi-Agent Systems"],</div>
                            <div class="code-line indent3">"frameworks": ["TensorFlow", "PyTorch", "FastAPI"],</div>
                            <div class="code-line indent3">"tools": ["Docker", "AWS", "GitHub"]</div>
                            <div class="code-line indent2">}</div>
                            <div class="code-line"></div>
                            <div class="code-line indent">def mission(self):</div>
                            <div class="code-line indent2">return "Building intelligent AI solutions that create real-world impact 🚀"</div>
                            <div class="code-line"></div>
                            <div class="code-line">candidate = DeveloperProfile()</div>
                            <div class="code-line">print(candidate.mission())</div>
                        </div>
                    </div>
                </div>
            </div>

            """

# Replace the block
new_content = content[:start_idx] + new_about_visual + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("SUCCESSFULLY CLEANED UP ABOUT-VISUAL CARD!")
