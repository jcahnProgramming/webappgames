import React, { useMemo, useState } from "react";
import { useArcade } from "../context/ArcadeContext"

type MadLibPrompt = {
  key: string;
  label: string;
};

type MadLibTemplate = {
  id: string;
  title: string;
  description: string;
  prompts: MadLibPrompt[];
  template: string; // uses {{key}} tokens
};

const TEMPLATES: MadLibTemplate[] = [
  {
    id: "space-adventure",
    title: "Space Adventure",
    description: "Blast off into a ridiculous mission among the stars.",
    prompts: [
      { key: "name", label: "A name" },
      { key: "adjective1", label: "An adjective" },
      { key: "adjective2", label: "Another adjective" },
      { key: "noun1", label: "A noun" },
      { key: "verb1", label: "A verb (present tense)" },
      { key: "verb2", label: "A verb (past tense)" },
      { key: "pluralNoun1", label: "A plural noun" },
      { key: "exclamation", label: "An exclamation" },
    ],
    template:
      "{{name}} always dreamed of traveling through {{adjective1}} space. " +
      "One day, a {{adjective2}} {{noun1}} appeared outside their window and asked, " +
      '“Do you want to {{verb1}} the galaxy with me?” ' +
      "{{name}} {{verb2}} their backpack, grabbed some {{pluralNoun1}}, and shouted, " +
      "“{{exclamation}}!” The adventure had begun.",
  },
  {
    id: "office-drama",
    title: "Office Drama",
    description: "A very serious day at a very silly office.",
    prompts: [
      { key: "jobTitle", label: "A job title" },
      { key: "adjective1", label: "An adjective" },
      { key: "adjective2", label: "Another adjective" },
      { key: "officeObject", label: "An office object" },
      { key: "food", label: "A food" },
      { key: "verbIng", label: "A verb ending in -ing" },
      { key: "emotion", label: "An emotion" },
      { key: "celebrity", label: "A celebrity" },
    ],
    template:
      "As the new {{jobTitle}}, it was {{adjective1}} enough to survive the meetings. " +
      "But today was extra {{adjective2}}. Someone had replaced the coffee machine with a giant {{officeObject}}, " +
      "and the break room smelled like {{food}}. In the corner, everyone was {{verbIng}} with pure {{emotion}}, " +
      "and someone swore they saw {{celebrity}} on the Zoom call.",
  },
  {
    id: "fantasy-quest",
    title: "Fantasy Quest",
    description: "A totally normal quest that definitely won’t go wrong.",
    prompts: [
      { key: "heroName", label: "A hero name" },
      { key: "creature", label: "A fantasy creature" },
      { key: "place", label: "A place" },
      { key: "magicItem", label: "A magical item" },
      { key: "sillyCurse", label: "A silly curse" },
      { key: "verb1", label: "A verb" },
      { key: "pluralNoun", label: "A plural noun" },
    ],
    template:
      "The legendary hero {{heroName}} faced a terrifying {{creature}} at the gates of {{place}}. " +
      "Armed only with a glowing {{magicItem}} and a backpack full of {{pluralNoun}}, " +
      "{{heroName}} shouted the ancient spell of {{sillyCurse}} and prepared to {{verb1}} into destiny.",
  },
];

type InputsState = Record<string, string>;

export const MadLibsGame: React.FC = () => {
  const { recordGameResult, addCoins, unlockAchievement } = useArcade();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    TEMPLATES[0]?.id ?? ""
  );
  const [inputs, setInputs] = useState<InputsState>({});
  const [story, setStory] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const template = useMemo(
    () => TEMPLATES.find((t) => t.id === selectedTemplateId) ?? TEMPLATES[0],
    [selectedTemplateId]
  );

  // Reset inputs when template changes
  React.useEffect(() => {
    setInputs({});
    setStory(null);
    setHasGenerated(false);
    setMessage(null);
  }, [template.id]);

  const handleInputChange = (key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const allFilled =
    template.prompts.length > 0 &&
    template.prompts.every((p) => (inputs[p.key] ?? "").trim().length > 0);

  const handleGenerate = () => {
    if (!allFilled) {
      setMessage("Fill in all the blanks to generate your story.");
      return;
    }

    let text = template.template;
    for (const prompt of template.prompts) {
      const value = (inputs[prompt.key] ?? "").trim() || "____";
      const token = new RegExp(`{{${prompt.key}}}`, "g");
      text = text.replace(token, value);
    }

    setStory(text);
    setMessage(null);
    setHasGenerated(true);

    // Treat completing a story as a "win" / completion
    recordGameResult({
      gameId: "madlibs",
      win: true,
      moves: template.prompts.length,
    });

    addCoins(3, "madlibs_story");
    unlockAchievement("madlibs_first_story");
  };

  const handleRandomize = () => {
    const idx = Math.floor(Math.random() * TEMPLATES.length);
    setSelectedTemplateId(TEMPLATES[idx].id);
  };

  const handleReset = () => {
    setInputs({});
    setStory(null);
    setHasGenerated(false);
    setMessage(null);
  };

  return (
    <div className="madlibs">
      <div className="madlibs-header">
        <h2>Mad Libs Story Forge</h2>
        <p className="madlibs-subtitle">
          Fill in the blanks, hit generate, and enjoy the chaos.
        </p>
      </div>

      {/* Template selector */}
      <div className="madlibs-template-row">
        <label className="madlibs-label">
          Story template
          <select
            className="madlibs-select"
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="secondary-button madlibs-random"
          onClick={handleRandomize}
        >
          Surprise me
        </button>
      </div>

      <p className="madlibs-description">{template.description}</p>

      {/* Inputs grid */}
      <div className="madlibs-grid">
        {template.prompts.map((prompt) => (
          <div key={prompt.key} className="madlibs-field">
            <label className="madlibs-label">
              {prompt.label}
              <input
                type="text"
                className="madlibs-input"
                value={inputs[prompt.key] ?? ""}
                onChange={(e) => handleInputChange(prompt.key, e.target.value)}
                placeholder="Type here..."
              />
            </label>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="madlibs-actions">
        <button
          type="button"
          className="primary-button"
          onClick={handleGenerate}
        >
          Generate Story
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={handleReset}
        >
          Clear
        </button>
      </div>

      {message && <p className="madlibs-message">{message}</p>}

      {/* Story output */}
      {story && (
        <div className="madlibs-story">
          <h3>Your Story</h3>
          <p>{story}</p>
          {hasGenerated && (
            <p className="madlibs-story-meta">
              +3 coins earned for completing a story.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
