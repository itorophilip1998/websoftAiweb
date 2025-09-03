import React, { useState } from "react";
import { ragService } from "../services/ragService";
import { env } from "../config/env";

interface RAGDemoProps {
  userId?: string;
}

export const RAGDemo: React.FC<RAGDemoProps> = ({ userId = "demo-user" }) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      if (env.ENABLE_RAG) {
        const searchResults = await ragService.searchKnowledge(query, 5);
        setResult(
          `Search results for "${query}":\n${searchResults.join("\n\n")}`
        );
      } else {
        setResult(
          "RAG functionality is not enabled. Please set VITE_ENABLE_RAG=true in your environment variables."
        );
      }
    } catch (error) {
      setResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetUserInfo = async () => {
    setLoading(true);
    try {
      if (env.ENABLE_RAG) {
        const info = await ragService.getUserInfo();
        setUserInfo(info);
        setResult(
          `User Info Retrieved:\nAssets: ${info.assets?.length || 0}\nSpaces: ${
            info.spaces?.length || 0
          }\nLocations: ${info.locations?.length || 0}`
        );
      } else {
        setResult("RAG functionality is not enabled.");
      }
    } catch (error) {
      setResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLocation = async () => {
    setLoading(true);
    try {
      if (env.ENABLE_RAG) {
        const result = await ragService.createLocation({
          name: "Demo Location",
          city: "Demo City",
          state: "Demo State",
          country: "Demo Country",
        });
        setResult(result);
      } else {
        setResult("RAG functionality is not enabled.");
      }
    } catch (error) {
      setResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">RAG Integration Demo</h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          RAG Status: {env.ENABLE_RAG ? "✅ Enabled" : "❌ Disabled"}
        </p>
        <p className="text-sm text-gray-600 mb-2">API URL: {env.RAG_API_URL}</p>
        <p className="text-sm text-gray-600 mb-4">User ID: {userId}</p>
      </div>

      <div className="space-y-4">
        {/* Knowledge Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Knowledge Base
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search query..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* User Info */}
        <div>
          <button
            onClick={handleGetUserInfo}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Get User Info"}
          </button>
        </div>

        {/* Create Location */}
        <div>
          <button
            onClick={handleCreateLocation}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Demo Location"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded-md text-sm whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}

        {/* User Info Display */}
        {userInfo && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">User Data:</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <p>
                <strong>Assets:</strong> {userInfo.assets?.length || 0}
              </p>
              <p>
                <strong>Spaces:</strong> {userInfo.spaces?.length || 0}
              </p>
              <p>
                <strong>Locations:</strong> {userInfo.locations?.length || 0}
              </p>

              {userInfo.assets?.length > 0 && (
                <div className="mt-2">
                  <strong>Asset Names:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {userInfo.assets.map((asset: any, index: number) => (
                      <li key={index}>{asset.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h4 className="font-semibold text-yellow-800 mb-2">
          Setup Instructions:
        </h4>
        <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
          <li>Set up your Python backend API with the provided code</li>
          <li>Configure your PostgreSQL database with the required schema</li>
          <li>Set VITE_ENABLE_RAG=true in your .env file</li>
          <li>Set VITE_RAG_API_URL to your backend API URL</li>
          <li>Start your backend API server</li>
        </ol>
      </div>
    </div>
  );
};

export default RAGDemo;
