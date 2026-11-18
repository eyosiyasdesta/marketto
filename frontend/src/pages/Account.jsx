import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, UserRound, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/store";
import { toast } from "sonner";
export function Account({ initialMode = "login" }) {
  const { user, authenticate, signOut, saveProfile } = useStore();
  const [mode, setMode] = useState(initialMode),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  if (user)
    return (
      <div className="container page">
        <div className="page-heading">
          <span className="eyebrow">YOUR LITTLE CORNER OF MARKETTO</span>
          <h1>Hello, {user.displayName}.</h1>
          <p>Good to have you here.</p>
        </div>
        <div className="account-layout">
          <form
            className="account-panel"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await saveProfile(Object.fromEntries(new FormData(e.currentTarget)));
              } catch (e) {
                toast.error(e.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <h2>
              <UserRound size={23} />
              Your profile
            </h2>
            <label>
              Full name
              <input name="name" defaultValue={user.name} required />
            </label>
            <label>
              Display name
              <input name="displayName" defaultValue={user.displayName} required />
            </label>
            <label>
              Email address
              <input value={user.email} readOnly type="email" />
            </label>
            <label>
              Favorite collection
              <select name="preferences" defaultValue={user.preferences}>
                {[
                  "All collections",
                  "Electronics",
                  "Clothing",
                  "Home & Living",
                  "Books",
                  "Accessories",
                ].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <Button disabled={busy}>
              Save profile
              <ArrowRight />
            </Button>
          </form>
          <div className="account-links">
            <Button asChild variant="outline">
              <Link to="/orders">
                <Package />
                View your orders
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/checkout">
                Continue to checkout
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="ghost" onClick={signOut}>
              <LogOut />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  return (
    <div className="container page">
      <div className="auth-panel">
        <span className="eyebrow">YOUR EVERYDAY STARTS HERE</span>
        <h1>{mode === "login" ? "Welcome back." : "A little hello."}</h1>
        <p>
          {mode === "login"
            ? "Sign in to your Marketto account."
            : "Make yourself at home at Marketto."}
        </p>
        <div className="auth-tabs">
          <Button
            variant={mode === "login" ? "default" : "ghost"}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Sign in
          </Button>
          <Button
            variant={mode === "register" ? "default" : "ghost"}
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            Create account
          </Button>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              await authenticate(mode, Object.fromEntries(new FormData(e.currentTarget)));
              toast.success(mode === "login" ? "Welcome back." : "Welcome to Marketto.");
            } catch (e) {
              setError(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {mode === "register" && (
            <>
              <label>
                Full name
                <input name="name" required autoComplete="name" />
              </label>
              <label>
                Display name
                <input name="displayName" required />
              </label>
              <label>
                Favorite collection
                <select name="preferences">
                  {[
                    "All collections",
                    "Electronics",
                    "Clothing",
                    "Home & Living",
                    "Books",
                    "Accessories",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </>
          )}
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              minLength="8"
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <Button className="wide" type="submit" disabled={busy}>
            {busy ? "Just a moment…" : mode === "login" ? "Sign in" : "Create account"}
            <ArrowRight />
          </Button>
        </form>
        <p className="demo-notice">
          Your account is secured by Marketto. Use your registered email and password to sign in.
        </p>
      </div>
    </div>
  );
}
