import { maskApiKey, copyToClipboard } from "../utils/apiKeyUtils";

export default function ApiKeyTable({
  apiKeys,
  isAdding,
  setIsAdding,
  newUser,
  setNewUser,
  newKey,
  setNewKey,
  editId,
  editUser,
  setEditUser,
  editKey,
  setEditKey,
  revealedKeys,
  handleAddSave,
  handleAddCancel,
  handleEdit,
  handleSave,
  handleDelete,
  toggleKeyVisibility,
  showNotification
}) {
  const handleCopyToClipboard = async (key) => {
    const result = await copyToClipboard(key);
    showNotification(result.message, result.success ? 'success' : 'error');
  };

  const getUsage = (k) => {
    const u = typeof k?.usage === 'number' ? k.usage : (typeof k?.usage_count === 'number' ? k.usage_count : 0);
    return u ?? 0;
  };
  const getLimit = (k) => {
    const l = typeof k?.limit === 'number' ? k.limit : (typeof k?.usage_limit === 'number' ? k.usage_limit : null);
    return l;
  };
  const renderUsage = (k) => {
    const u = getUsage(k);
    const l = getLimit(k);
    return l != null ? `${u}/${l}` : `${u}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">API Keys</h3>
          <button
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setIsAdding(true)}
          >
            +
          </button>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          The key is used to authenticate your requests to the Research API. To learn more, see the <a href="#" className="underline">documentation page</a>.
        </p>
      </div>
      
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USAGE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KEY</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OPTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isAdding && (
              <tr>
                <td className="px-6 py-4">
                  <input
                    className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newUser}
                    onChange={e => setNewUser(e.target.value)}
                    placeholder="Name"
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">dev</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">0/200</span>
                </td>
                <td className="px-6 py-4">
                  <input
                    className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newKey}
                    onChange={e => setNewKey(e.target.value)}
                    placeholder="API Key"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                      onClick={handleAddSave}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                      onClick={handleAddCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {apiKeys.map((k) => (
              <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                {editId === k.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={editUser}
                        onChange={(e) => setEditUser(e.target.value)}
                        placeholder="Name"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="dev">dev</option>
                        <option value="prod">prod</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{renderUsage(k)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={editKey}
                        onChange={(e) => setEditKey(e.target.value)}
                        placeholder="API Key"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{k.user}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        dev
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{renderUsage(k)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-700">{revealedKeys.has(k.id) ? k.key : maskApiKey(k.key)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
                          onClick={() => toggleKeyVisibility(k.id)}
                          title={revealedKeys.has(k.id) ? "Hide" : "Show"}
                        >
                          {revealedKeys.has(k.id) ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
                          onClick={() => handleCopyToClipboard(k.key)}
                          title="Copy to clipboard"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
                          onClick={() => handleEdit(k.id, k.user, k.key)}
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(k.id)}
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="sm:hidden divide-y divide-gray-100 overflow-x-hidden">
        {isAdding && (
          <div className="p-4 space-y-3">
            <input
              className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newUser}
              onChange={e => setNewUser(e.target.value)}
              placeholder="Name"
            />
            <input
              className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              placeholder="API Key"
            />
            <div className="flex items-center gap-2">
              <button
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                onClick={handleAddSave}
              >
                Save
              </button>
              <button
                className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                onClick={handleAddCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {apiKeys.map((k) => (
          <div key={k.id} className="p-4 max-w-full">
            {editId === k.id ? (
              <div className="space-y-3">
                <input
                  className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editUser}
                  onChange={(e) => setEditUser(e.target.value)}
                  placeholder="Name"
                />
                <input
                  className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editKey}
                  onChange={(e) => setEditKey(e.target.value)}
                  placeholder="API Key"
                />
                <div className="flex items-center gap-2">
                  <button
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{k.user}</div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">dev</span>
                </div>
                <div className="text-sm text-gray-700 break-all font-mono">
                  {revealedKeys.has(k.id) ? k.key : maskApiKey(k.key)}
                </div>
                <div className="text-xs text-gray-600">Usage: {renderUsage(k)}</div>
                <div className="flex flex-wrap items-center justify-start gap-1 pt-1">
                  <button
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                    onClick={() => toggleKeyVisibility(k.id)}
                    title={revealedKeys.has(k.id) ? "Hide" : "Show"}
                    aria-label={revealedKeys.has(k.id) ? "Hide key" : "Show key"}
                  >
                    {revealedKeys.has(k.id) ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  <button
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                    onClick={() => handleCopyToClipboard(k.key)}
                    title="Copy"
                    aria-label="Copy key"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                    onClick={() => handleEdit(k.id, k.user, k.key)}
                    title="Edit"
                    aria-label="Edit key"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    className="p-2 rounded-md text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(k.id)}
                    title="Delete"
                    aria-label="Delete key"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 