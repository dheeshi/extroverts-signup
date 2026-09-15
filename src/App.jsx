import { useEffect, useRef, useState } from "react";
import "./App.css";
import { completeSignup, sendOtp, verifyOtp } from "./signup/signupService";

const screens = {
  LANDING: "landing",
  TERMS: "terms",
  ACCOUNT_PROMPT: "account-prompt",
  EMAIL: "email",
  OTP: "otp",
  USERNAME: "username",
  NAME: "name",
  AGE: "age",
  PRONOUNS: "pronouns",
  INVITE: "invite",
  SUCCESS: "success",
};

const PRONOUN_OPTIONS = [
  "he/him",
  "she/her",
  "he/him/his",
  "she/her/hers",
  "they/them",
  "ze/zir",
  "xe/xem",
  "ve/ver",
  "ey/em",
  "per/pers",
  "fae/faer",
  "zie/hir",
  "it/its",
  "co/cos",
];

function Button({
  children,
  disabled = false,
  variant = "primary",
  loading = false,
  ...props
}) {
  return (
    <button
      className={`app-button app-button--${variant}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="button-spinner" /> : children}
    </button>
  );
}

function Logo() {
  return <div className="logo">E</div>;
}

function ScreenShell({ children, className = "" }) {
  return <main className={`screen-shell ${className}`}>{children}</main>;
}

function Progress({ current, total = 4 }) {
  return (
    <div
      className="progress-wrap"
      aria-label={`Signup progress: step ${current} of ${total}`}
    >
      <div className="progress-bar">
        {Array.from({ length: total }).map((_, index) => (
          <span
            key={index}
            className={`progress-segment ${index < current ? "is-complete" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

function GlobalToast({ message, type = "error", onClose }) {
  if (!message) return null;
  return (
    <div className={`global-toast global-toast--${type}`} role="alert">
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
}

function Header({ progress }) {
  return (
    <div className="app-header">
      <Logo />
      <span className="header-title">GETTING READY</span>
      {progress ? <Progress current={progress} /> : null}
    </div>
  );
}

function LandingScreen({ onContinue }) {
  return (
    <ScreenShell className="landing-screen">
      <div className="landing-art" aria-hidden="true">
        <div className="landing-glow landing-glow--one" />
        <div className="landing-glow landing-glow--two" />
        <div className="landing-glow landing-glow--three" />
        <div className="landing-mountain" />
      </div>
      <div className="landing-content">
        <Logo />
        <div className="landing-copy">
          <p className="eyebrow">AN APP ONLY FOR</p>
          <h1>EXTROVERTS</h1>
          <p className="landing-description">
            Writing: Enjoying many loud, spontaneous, daring and unfiltered
            moments together.
          </p>
        </div>
        <Button onClick={onContinue}>CONTINUE</Button>
      </div>
    </ScreenShell>
  );
}

function TermsScreen({ onAccept }) {
  return (
    <ScreenShell className="terms-screen">
      <div className="terms-content">
        <Logo />
        <div className="terms-text">
          <p>
            BY USING THIS APP, YOU&apos;RE AGREEING TO KEEP THINGS FUN, SAFE,
            AND RESPECTFUL... AND ALSO AGREEING TO OUR TERMS AND CONDITIONS.
          </p>
          <p>
            BOLDNESS IS NOT A RIGHT TO TREAT OTHERS HOW YOU&apos;D WANT TO BE
            TREATED. EVERYONE HERE IS LOOKING FOR REASONS TO VIBE, SO BRING YOUR
            BEST VIBE AND EXPECT THE SAME FROM OTHERS.
          </p>
          <p>
            LET&apos;S PARTY RESPONSIBLY AND MAKE EVERY EXPERIENCE A GREAT ONE!
          </p>
        </div>
        <div className="terms-actions">
          <p className="terms-link">
            To proceed, accept our Terms and Conditions.
          </p>
          <Button onClick={onAccept}>ACCEPT</Button>
          <span className="terms-mark">E</span>
        </div>
      </div>
    </ScreenShell>
  );
}

function AccountPrompt({ onCreateAccount, onClose }) {
  return (
    <div className="modal-backdrop">
      <section
        className="account-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-modal-title"
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 id="account-modal-title">YOU NEED AN ACCOUNT</h2>
        <p>
          Looks like you&apos;re not signed in. Create an account to join the
          party with extroverts near you.
        </p>
        <Button onClick={onCreateAccount}>CREATE AN ACCOUNT</Button>
      </section>
    </div>
  );
}

function EmailScreen({
  email,
  setEmail,
  newsletter,
  setNewsletter,
  onProceed,
  onBack,
  onToast,
}) {
  const [touched, setTouched] = useState(false);
  //const [loading, setLoading] = useState(false);
  const value = email.trim();
  const isValid =
    value.length > 0 &&
    value.length <= 120 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const showError = touched && !isValid;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(true);

    if (!isValid) return;

    try {
      const result = await sendOtp(value);

      if (result.success) {
        onProceed();
      } else {
        onToast(
          result.message || "Unable to send the verification code.",
          "error",
        );
      }
    } catch {
      onToast(
        "Unable to send the verification code. Please try again.",
        "error",
      );
    }
  };

  return (
    <ScreenShell className="form-screen">
      <form className="form-content" onSubmit={handleSubmit}>
        <Header />
        <div className="form-heading">
          <h1>Enter your email</h1>
        </div>
        <div className="field-group">
          <label htmlFor="email">EMAIL</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={120}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.replace(/\s/g, ""));
              setTouched(true);
            }}
            onBlur={() => setTouched(true)}
            className={showError ? "input-error" : ""}
            aria-invalid={showError}
          />
          {showError && (
            <p className="field-error" role="alert">
              Please enter a valid email address.
            </p>
          )}
        </div>
        <div className="form-actions">
          <Button type="submit" disabled={!isValid}>
            PROCEED
          </Button>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
            />
            <span>I&apos;d like to subscribe to your newsletter</span>
          </label>
          <Button type="button" variant="secondary" onClick={onBack}>
            GO BACK
          </Button>
        </div>
      </form>
    </ScreenShell>
  );
}

function OtpInput({ value, onChange, disabled, error }) {
  const inputRef = useRef(null);
  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="otp-wrapper">
      <div
        className={`otp-slots ${error ? "otp-slots--error" : ""}`}
        onClick={() => inputRef.current?.focus()}
        role="group"
        aria-label="One-time verification code"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={`otp-slot ${index === value.length ? "otp-slot--active" : ""} ${index < value.length ? "otp-slot--filled" : ""}`}
          >
            {value[index] || ""}
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        className="otp-hidden-input"
        value={value}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, 6))
        }
        onPaste={(e) => {
          e.preventDefault();
          onChange(
            e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6),
          );
        }}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        disabled={disabled}
        aria-label="Enter 6 digit verification code"
      />
    </div>
  );
}

function OtpScreen({ email, onVerified, onBack, onToast }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  //const [loading, setLoading] = useState(false);
  //const [resendLoading, setResendLoading] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  useEffect(() => {
    if (secondsRemaining <= 0) return undefined;
    const timer = window.setInterval(
      () => setSecondsRemaining((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [secondsRemaining]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;

    setError("");

    try {
      const result = await verifyOtp(email, otp);

      if (!result.success) {
        setError(result.message);
        setOtp("");
        onToast(
          "Verification failed. Please check the OTP and try again.",
          "error",
        );
        return;
      }

      onVerified();
    } catch {
      setError("Unable to verify the OTP. Please try again.");
      onToast("Verification failed. Please try again.", "error");
    }
  };

  const handleResend = async () => {
    if (secondsRemaining > 0) return;

    setError("");

    try {
      const result = await sendOtp(email);

      if (result.success) {
        setOtp("");
        setSecondsRemaining(60);
      } else {
        onToast(
          result.message || "Unable to resend the OTP. Please try again.",
          "error",
        );
      }
    } catch {
      onToast("Unable to resend the OTP. Please try again.", "error");
    }
  };

  return (
    <ScreenShell className="form-screen">
      <div className="form-content otp-screen">
        <Header />
        <div className="form-heading">
          <h1>Enter OTP</h1>
        </div>
        <p className="otp-description">
          Enter the 6-digit verification code sent to <strong>{email}</strong>
        </p>
        <OtpInput
          value={otp}
          onChange={(v) => {
            setOtp(v);
            setError("");
          }}
          error={Boolean(error)}
        />
        {error && (
          <p className="field-error otp-error" role="alert">
            {error}
          </p>
        )}
        <div className="resend-row">
          {secondsRemaining > 0 ? (
            <span>Resend OTP in {secondsRemaining}s</span>
          ) : (
            <button
              type="button"
              className="resend-button"
              onClick={handleResend}
            >
              RESEND OTP{" "}
            </button>
          )}
        </div>
        <div className="form-actions">
          <Button onClick={handleVerify} disabled={otp.length !== 6}>
            VERIFY
          </Button>
          <Button variant="secondary" onClick={onBack}>
            GO BACK
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}

function UsernameScreen({ username, setUsername, onProceed, onBack, onToast }) {
  const [touched, setTouched] = useState(false);
  //const [loading, setLoading] = useState(false);
  const value = username.trim();
  const isValid =
    value.length >= 6 && value.length <= 30 && /^[a-zA-Z0-9._-]+$/.test(value);
  const showError = touched && !isValid;

  const getError = () => {
    if (!value) return "Username is required.";
    if (value.length < 6) return "Username must be at least 6 characters.";
    if (!/^[a-zA-Z0-9._-]+$/.test(value))
      return "Use only letters, numbers, dots, underscores or hyphens.";
    return "Please enter a valid username.";
  };

  const submit = (event) => {
    event.preventDefault();

    setTouched(true);

    if (!isValid) return;

    onProceed();
  };

  return (
    <ScreenShell className="form-screen">
      <form className="form-content" onSubmit={submit}>
        <Header progress={1} />
        <div className="form-heading">
          <h1>Create a username that fits your vibe!</h1>
        </div>
        <div className="field-group">
          <label htmlFor="username">USERNAME</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            maxLength={30}
            value={username}
            onChange={(e) => {
              setUsername(
                e.target.value
                  .replace(/\s/g, "")
                  .replace(/[^a-zA-Z0-9._-]/g, "")
                  .slice(0, 30),
              );
              setTouched(true);
            }}
            onBlur={() => setTouched(true)}
            className={showError ? "input-error" : ""}
            aria-invalid={showError}
          />
          {showError ? (
            <p className="field-error" role="alert">
              {getError()}
            </p>
          ) : (
            <p className="field-hint">
              At least 6 characters. Letters, numbers and . _ - only.
            </p>
          )}
        </div>
        <div className="form-actions">
          <Button type="submit" disabled={!isValid}>
            NEXT
          </Button>
        </div>
      </form>
    </ScreenShell>
  );
}

function NameScreen({ name, setName, onProceed, onBack, onToast }) {
  const [touched, setTouched] = useState(false);
  //const [loading, setLoading] = useState(false);
  const value = name.trim();
  const isValid =
    value.length >= 3 && value.length <= 50 && !/\s{2,}/.test(value);
  const showError = touched && !isValid;

  const submit = (event) => {
    event.preventDefault();

    setTouched(true);

    if (!isValid) return;

    onProceed();
  };

  return (
    <ScreenShell className="form-screen">
      <form className="form-content" onSubmit={submit}>
        <Header progress={1} />
        <div className="form-heading">
          <h1>&quot;Name, please, for the party check!&quot;</h1>
        </div>
        <div className="field-group">
          <label htmlFor="name">NAME</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            maxLength={50}
            value={name}
            onChange={(e) => {
              setName(e.target.value.replace(/^\s+/, "").slice(0, 50));
              setTouched(true);
            }}
            onBlur={() => setTouched(true)}
            className={showError ? "input-error" : ""}
            aria-invalid={showError}
          />
          {showError ? (
            <p className="field-error" role="alert">
              {!value
                ? "Name is required."
                : value.length < 3
                  ? "Name must be at least 3 characters."
                  : "Please check the spaces in your name."}
            </p>
          ) : (
            <p className="field-hint">
              This is the name other people will see on your profile.
            </p>
          )}
        </div>
        <div className="form-actions">
          <Button type="submit" disabled={!isValid}>
            NEXT
          </Button>
          <Button type="button" variant="secondary" onClick={onBack}>
            GO BACK
          </Button>
        </div>
      </form>
    </ScreenShell>
  );
}

function getLocalToday() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function calculateAge(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;
  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  )
    age--;
  return age;
}

function DobPicker({ dob, setDob, onContinue, onClose }) {
  const initial = dob ? dob.split("-") : ["", "", ""];
  const [day, setDay] = useState(initial[2] || "");
  const [month, setMonth] = useState(initial[1] || "");
  const [year, setYear] = useState(initial[0] || "");
  const [error, setError] = useState("");
  //const [loading, setLoading] = useState(false);

  const validate = (nextDay = day, nextMonth = month, nextYear = year) => {
    if (!nextDay || !nextMonth || !nextYear)
      return "Please enter your complete date of birth.";
    const y = Number(nextYear),
      m = Number(nextMonth),
      d = Number(nextDay);
    const date = new Date(y, m - 1, d);
    if (
      date.getFullYear() !== y ||
      date.getMonth() !== m - 1 ||
      date.getDate() !== d
    )
      return "Please enter a valid date.";
    const value = `${nextYear}-${nextMonth}-${nextDay}`;
    const age = calculateAge(value);
    if (value > getLocalToday())
      return "Date of birth cannot be in the future.";
    if (age < 18) return "You must be 18 or older to join.";
    if (age > 100) return "Please enter a valid date of birth.";
    return "";
  };

  const handleChange = (setter, field, max) => (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, max);
    setter(digits);
    setError("");
    const next = { day, month, year, [field]: digits };
    if (next.day && next.month && next.year)
      setError(validate(next.day, next.month, next.year));
  };

  const proceed = () => {
    const validation = validate();
    setError(validation);

    if (validation) return;

    const value = `${year}-${month}-${day}`;

    setDob(value);
    onContinue(calculateAge(value));
  };

  return (
    <div className="modal-backdrop">
      <section
        className="bottom-sheet dob-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dob-title"
      >
        <div className="sheet-handle" />
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 id="dob-title">DATE OF BIRTH</h2>
        <div className="dob-fields">
          <input
            autoFocus
            inputMode="numeric"
            placeholder="DD"
            aria-label="Day"
            value={day}
            onChange={handleChange(setDay, "day", 2)}
          />
          <input
            inputMode="numeric"
            placeholder="MM"
            aria-label="Month"
            value={month}
            onChange={handleChange(setMonth, "month", 2)}
          />
          <input
            inputMode="numeric"
            placeholder="YYYY"
            aria-label="Year"
            value={year}
            onChange={handleChange(setYear, "year", 4)}
          />
        </div>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <Button
          onClick={proceed}
          disabled={!day || !month || !year || Boolean(error)}
        >
          PROCEED
        </Button>
      </section>
    </div>
  );
}

function AgeScreen({ age, setAge, dob, setDob, onProceed, onBack, onToast }) {
  const [showDobPicker, setShowDobPicker] = useState(false);

  return (
    <ScreenShell className="form-screen">
      <div className="form-content age-screen">
        <Header progress={2} />
        <div className="form-heading">
          <h1>How many years have you been partying?</h1>
        </div>
        <div className="field-group">
          <label htmlFor="age">AGE</label>
          <input
            id="age"
            type="text"
            inputMode="none"
            readOnly
            value={age}
            placeholder=""
            onFocus={() => setShowDobPicker(true)}
            onClick={() => setShowDobPicker(true)}
          />
          <p className="field-hint">
            We need your age to verify you&apos;re eligible and help others know
            who they&apos;re connecting with.
          </p>
        </div>
        <div className="form-actions">
          <Button onClick={onProceed} disabled={!age}>
            NEXT
          </Button>
          <Button variant="secondary" onClick={onBack}>
            BACK
          </Button>
        </div>
      </div>
      {showDobPicker && (
        <DobPicker
          dob={dob}
          setDob={setDob}
          onContinue={(calculatedAge) => {
            setAge(String(calculatedAge));
            setShowDobPicker(false);
            onToast("Age verified successfully.", "success");
          }}
          onClose={() => setShowDobPicker(false)}
        />
      )}
    </ScreenShell>
  );
}

function PronounPicker({
  selected,
  customPronouns,
  onSelect,
  onClose,
  onAddCustom,
}) {
  const [search, setSearch] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const all = [...PRONOUN_OPTIONS, ...customPronouns].filter(
    (item, i, arr) => arr.indexOf(item) === i,
  );
  const filtered = all.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase()),
  );

  if (showCustom) {
    return (
      <PronounCustomSheet
        onClose={() => setShowCustom(false)}
        onAdd={(items) => {
          onAddCustom(items);
          setShowCustom(false);
        }}
      />
    );
  }

  return (
    <div className="modal-backdrop">
      <section
        className="bottom-sheet pronoun-picker"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pronoun-title"
      >
        <div className="sheet-handle" />
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 id="pronoun-title">PRONOUNS</h2>
        <input
          className="sheet-input pronoun-search-input"
          placeholder="Search pronouns"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="pronoun-sheet-list">
          {filtered.map((pronoun) => (
            <button
              type="button"
              className={`pronoun-choice ${selected.includes(pronoun) ? "is-selected" : ""}`}
              key={pronoun}
              onClick={() => onSelect(pronoun)}
            >
              <span>{pronoun}</span>
              <span>{selected.includes(pronoun) ? "✓" : "+"}</span>
            </button>
          ))}
          {!filtered.length && (
            <p className="empty-message">No matching pronouns found.</p>
          )}
        </div>
        <button
          type="button"
          className="add-pronouns-button"
          onClick={() => setShowCustom(true)}
        >
          + ADD MORE PRONOUNS
        </button>
        <Button onClick={onClose} disabled={!selected.length}>
          DONE
        </Button>
      </section>
    </div>
  );
}

function PronounCustomSheet({ onClose, onAdd }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const request = async () => {
    const items = value
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .filter((x, i, arr) => arr.indexOf(x) === i);
    if (!items.length) {
      setError("Please enter at least one pronoun.");
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onAdd(items);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <section className="bottom-sheet" role="dialog" aria-modal="true">
        <div className="sheet-handle" />
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2>CAN&apos;T FIND MORE?!</h2>
        <p className="sheet-description">
          Add the pronouns you&apos;d like us to consider.
        </p>
        <label className="sheet-label" htmlFor="custom-pronouns">
          ADD MORE PRONOUNS
        </label>
        <input
          id="custom-pronouns"
          className={`sheet-input ${error ? "input-error" : ""}`}
          placeholder="comma separated pronouns"
          value={value}
          maxLength={120}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
        />
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <Button onClick={request} disabled={!value.trim()} loading={loading}>
          REQUEST
        </Button>
      </section>
    </div>
  );
}

function PronounsScreen({
  pronouns,
  setPronouns,
  customPronouns,
  setCustomPronouns,
  onProceed,
  onBack,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const displayValue = pronouns.length ? pronouns.join(", ") : "";

  const toggle = (pronoun) => {
    setPronouns((current) =>
      current.includes(pronoun)
        ? current.filter((x) => x !== pronoun)
        : [...current, pronoun],
    );
  };

  return (
    <ScreenShell className="form-screen">
      <div className="form-content">
        <Header progress={3} />
        <div className="form-heading">
          <h1>Which pronouns feel right for you?</h1>
        </div>
        <div className="field-group">
          <label htmlFor="pronouns">PRONOUNS</label>
          <button
            type="button"
            id="pronouns"
            className={`select-field ${pronouns.length ? "has-value" : ""}`}
            onClick={() => setShowPicker(true)}
          >
            <span>{displayValue || "Select your pronouns"}</span>
            <span className="select-chevron">⌄</span>
          </button>
          <p className="field-hint">Tap the field to choose your pronouns.</p>
        </div>
        <div className="form-actions">
          <Button onClick={onProceed} disabled={!pronouns.length}>
            NEXT
          </Button>
          <Button variant="secondary" onClick={onBack}>
            BACK
          </Button>
        </div>
      </div>
      {showPicker && (
        <PronounPicker
          selected={pronouns}
          customPronouns={customPronouns}
          onSelect={toggle}
          onClose={() => setShowPicker(false)}
          onAddCustom={(items) =>
            setCustomPronouns((current) => [...new Set([...current, ...items])])
          }
        />
      )}
    </ScreenShell>
  );
}

function InviteScreen({ inviteCode, setInviteCode, onSubmit, onBack }) {
  const [loading, setLoading] = useState(false);
  const value = inviteCode.trim();

  const submit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell className="form-screen">
      <div className="form-content invite-screen">
        <Header progress={4} />
        <div className="invite-copy">
          <p>
            KINDNESS = GOOD <span>HAIR</span> DAY
          </p>
          <p>
            SIP IN? <span>CHIP IN.</span>
          </p>
          <p>
            GHOSTING IS FOR <span>HALLOWEEN.</span>
          </p>
          <p>
            OUTFITS LOUD, <span>INTENTIONS</span> CLEAR.
          </p>
          <p>
            JOINING? FREE. HOSTING? <span>ALSO FREE.</span>
          </p>
          <p>
            EARLY IS <span>ICONIC.</span>
          </p>
          <p>
            YES. <span>SPELLING</span> MISTAKE.
          </p>
        </div>
        <div className="field-group invite-field">
          <label htmlFor="invite-code">ENTER INVITE CODE (optional)</label>
          <input
            id="invite-code"
            type="text"
            maxLength={30}
            value={inviteCode}
            onChange={(e) =>
              setInviteCode(e.target.value.replace(/^\s+/, "").slice(0, 30))
            }
            placeholder=""
          />
          <p className="field-hint">
            Enter invite code and get up to +30 HVTs!
          </p>
        </div>
        <div className="form-actions">
          <Button onClick={submit} loading={loading}>
            SIGN UP
          </Button>
          <Button variant="secondary" onClick={onBack} disabled={loading}>
            BACK
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}

function SuccessScreen({ profile, onRestart }) {
  return (
    <ScreenShell className="success-screen">
      <div className="success-content">
        <Logo />
        <div className="success-icon">E</div>
        <h1>YOU&apos;RE IN!</h1>
        <p>
          Welcome to the party, <strong>{profile?.name}</strong>.
        </p>
        <Button onClick={onRestart}>ENTER EXTROVERTS</Button>
      </div>
    </ScreenShell>
  );
}

function App() {
  const [screen, setScreen] = useState(screens.LANDING);
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [pronouns, setPronouns] = useState([]);
  const [customPronouns, setCustomPronouns] = useState([]);
  const [inviteCode, setInviteCode] = useState("");
  const [profile, setProfile] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "error" });

  useEffect(() => {
    window.history.replaceState(
      { screen: screens.LANDING },
      "",
      window.location.href,
    );
    const handlePopState = (event) =>
      setScreen(event.state?.screen || screens.LANDING);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!toast.message) return undefined;
    const timer = window.setTimeout(
      () => setToast({ message: "", type: "error" }),
      3200,
    );
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = "error") => setToast({ message, type });

  const navigateTo = (nextScreen) => {
    window.history.pushState({ screen: nextScreen }, "", window.location.href);
    setScreen(nextScreen);
  };

  const replaceWith = (nextScreen) => {
    window.history.replaceState(
      { screen: nextScreen },
      "",
      window.location.href,
    );
    setScreen(nextScreen);
  };

  const resetSignup = () => {
    setEmail("");
    setNewsletter(false);
    setUsername("");
    setName("");
    setAge("");
    setDob("");
    setPronouns([]);
    setCustomPronouns([]);
    setInviteCode("");
    setProfile(null);
    navigateTo(screens.LANDING);
  };

  const handleCompleteSignup = async () => {
    const completedProfile = {
      email: email.trim(),
      newsletter,
      username: username.trim(),
      name: name.trim(),
      age: Number(age),
      dob,
      pronouns,
      inviteCode: inviteCode.trim(),
    };

    if (
      !completedProfile.email ||
      !completedProfile.username ||
      !completedProfile.name ||
      completedProfile.age < 18 ||
      !completedProfile.dob ||
      !completedProfile.pronouns.length
    ) {
      showToast("Please complete all required signup details.", "error");
      return;
    }

    try {
      const result = await completeSignup(completedProfile);
      if (!result.success) {
        showToast("Signup failed. Please try again.", "error");
        return;
      }
      setProfile(completedProfile);
      showToast("Signed up successfully!", "success");
      navigateTo(screens.SUCCESS);
    } catch {
      showToast("Signup failed. Please try again.", "error");
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case screens.TERMS:
        return (
          <TermsScreen onAccept={() => navigateTo(screens.ACCOUNT_PROMPT)} />
        );
      case screens.ACCOUNT_PROMPT:
        return (
          <>
            <TermsScreen onAccept={() => navigateTo(screens.EMAIL)} />
            <AccountPrompt
              onCreateAccount={() => navigateTo(screens.EMAIL)}
              onClose={() => navigateTo(screens.TERMS)}
            />
          </>
        );
      case screens.EMAIL:
        return (
          <EmailScreen
            email={email}
            setEmail={setEmail}
            newsletter={newsletter}
            setNewsletter={setNewsletter}
            onProceed={() => navigateTo(screens.OTP)}
            onBack={() => navigateTo(screens.TERMS)}
            onToast={showToast}
          />
        );
      case screens.OTP:
        return (
          <OtpScreen
            email={email}
            onVerified={() => replaceWith(screens.USERNAME)}
            onBack={() => navigateTo(screens.EMAIL)}
            onToast={showToast}
          />
        );
      case screens.USERNAME:
        return (
          <UsernameScreen
            username={username}
            setUsername={setUsername}
            onProceed={() => navigateTo(screens.NAME)}
          />
        );
      case screens.NAME:
        return (
          <NameScreen
            name={name}
            setName={setName}
            onProceed={() => navigateTo(screens.AGE)}
            onBack={() => navigateTo(screens.USERNAME)}
            onToast={showToast}
          />
        );
      case screens.AGE:
        return (
          <AgeScreen
            age={age}
            setAge={setAge}
            dob={dob}
            setDob={setDob}
            onProceed={() => navigateTo(screens.PRONOUNS)}
            onBack={() => navigateTo(screens.NAME)}
            onToast={showToast}
          />
        );
      case screens.PRONOUNS:
        return (
          <PronounsScreen
            pronouns={pronouns}
            setPronouns={setPronouns}
            customPronouns={customPronouns}
            setCustomPronouns={setCustomPronouns}
            onProceed={() => navigateTo(screens.INVITE)}
            onBack={() => navigateTo(screens.AGE)}
          />
        );
      case screens.INVITE:
        return (
          <InviteScreen
            inviteCode={inviteCode}
            setInviteCode={setInviteCode}
            onSubmit={handleCompleteSignup}
            onBack={() => navigateTo(screens.PRONOUNS)}
          />
        );
      case screens.SUCCESS:
        return <SuccessScreen profile={profile} onRestart={resetSignup} />;
      case screens.LANDING:
      default:
        return <LandingScreen onContinue={() => navigateTo(screens.TERMS)} />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
      <GlobalToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "error" })}
      />
    </div>
  );
}

export default App;
