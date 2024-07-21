'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { signInWithGoogle, signOutUser, auth,analytics } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Home = () => {
  const [inputText, setInputText] = useState<string>('');
  const [imageData, setImageData] = useState<{ photo: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state

    if (!inputText.trim()) {
      setError('Please enter some text before submitting.');
      return;
    }

    if (!user) {
      setError('You must be signed in to generate an image.');
      return;
    }

    try {
      const response = await fetch('/api/user');
      if (response.status === 429) {
        setError('Rate limit exceeded. Please try again later.');
        return;
      }
      const data = await response.json();
      setImageData(data);
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      setUser(user);
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      setError('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black text-white">
      <h1 className="text-4xl font-bold mb-6"> Text-Image Generator</h1>
      {!user ? (
        <button
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 mb-4"
        >
          Sign in with Google
        </button>
      ) : (
        <div className="mb-4 flex flex-col items-center">
          <p className="mb-2">Welcome, {user.displayName}</p>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 mb-4"
          >
            Sign Out
          </button>
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <button
              type="submit"
              className="w-full bg-black text-white border border-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-500 bg-red-100 p-2 rounded-md">{error}</div>
      )}
      {imageData && (
        <div className="mt-6">
          <Image
            src={imageData.photo}
            alt="Generated"
            width={600}
            height={600}
            className="object-cover rounded-md shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default Home;
