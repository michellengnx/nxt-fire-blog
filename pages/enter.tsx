import { useCallback, useContext, useEffect, useState } from "react";
// import Loader from "../components/Loader";
import { UserContextData } from "../lib/context";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import debounce from "../utils/debounce";

export default function Enter({}) {
  const { user, username } = useContext(UserContextData);
  console.log("in Enter page");

  console.log(user, username);
  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInWithGoogleButton />
      )}
    </main>
  );

  function SignInWithGoogleButton({}) {
    const signInWithGoogle = async () => {
      await auth.signInWithPopup(googleAuthProvider);
    };
    return (
      <button className="btn-google" onClick={signInWithGoogle}>
        <img src={"/google.png"} alt={"Google logo"} />
        Sign in with Google
      </button>
    );
  }
  function SignOutButton({}) {
    return (
      <button
        className="btn"
        onClick={() => {
          auth.signOut();
        }}
      >
        Sign out
      </button>
    );
  }
  function UsernameForm({}) {
    const [formValue, setFormValue] = useState(null);
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const onChange = (e) => {
      const value = e.target.value.toLowerCase();
      const regex = new RegExp(
        /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/
      );

      if (value.length < 3) {
        setFormValue(value);
        setIsValid(false);
        setLoading(false);
      }
      if (regex.test(value)) {
        setFormValue(value);
        setIsValid(false);
        // setLoading to true meaning the username satisfies the regex, now checking for availability
        setLoading(true);
      }
    };
    const onSubmit = async (e) => {
      const userDoc = firestore.doc(`users/${user.uid}`);
      const usernameDoc = firestore.doc(`usernames/${formValue}`);
      const batch = firestore.batch();
      batch.set(userDoc, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      batch.set(usernameDoc, {
        uid: user.uid,
      });
      await batch.commit();
    };
    useEffect(() => {
      checkUsername(formValue);
    }, [formValue]);

    const checkUsername = useCallback(
      debounce(async (username: String) => {
        if (username && username.length >= 3) {
          const ref = firestore.doc(`doc/${username}`);
          const { exists } = await ref.get();
          console.log("firestore read executed");
          setIsValid(!exists);
          setLoading(false);
        }
      }, 500),
      []
    );
    return (
      <section>
        <h3>Choose a username</h3>
        <form>
          <input
            name="username"
            placeholder="Username"
            value={formValue}
            onChange={onChange}
          />
          <UsernameValidationMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button
            className="btn-green"
            type="submit"
            disabled={!isValid}
            onSubmit={onSubmit}
          >
            Choose this name
          </button>
        </form>
      </section>
    );
  }
  function UsernameValidationMessage({ username, isValid, loading }) {
    if (loading) return <p>Checking...</p>;
    else if (isValid) return <p>{username} is available</p>;
    else if (username && !isValid)
      return <p>{username} not available! Please choose another one.</p>;
    else return <p></p>;
  }
}
