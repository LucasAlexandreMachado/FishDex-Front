🎣 Fish Pokédex - Frontend Context & Integration Guide

This document serves as a reference for developing the Fish Pokédex frontend, merging the backend business rules with the React architecture patterns (State Optimization, 1:N, and 1:1 relationships).
🚀 Environment Setup

    API Base URL: http://localhost:5238/api

    Tech Stack: React (Vite), Tailwind CSS, Lucide React, Axios.

    CORS: Fully enabled in the backend (Wide-open policy).

    Global Layout: Sidebar navigation with Icons (Fish, MapPin, Anchor).

🛠️ Service Layer (API endpoints)

Based on the productService.js and detalheProdutoService.js patterns, implement these services:
1. speciesService.js (Entity: Species)

    getSpecies() -> GET /species (Simple list).

    createSpecies(data) -> POST /species.

    deleteSpecies(id) -> DELETE /species/{id}.

        Note: Returns 400 if the species is linked to any catches.

2. catchService.js (Entity: Catch - 1:N)

    getCatches() -> GET /catches (Includes Species and Detail data).

    createCatch(data) -> POST /catches.

        Constraint: Do not send catchDate; the backend generates it automatically.

    deleteCatch(id) -> DELETE /catches/{id} (Cascade deletes the Detail).

3. catchDetailService.js (Entity: CatchDetail - 1:1)

    getDetailByCatchId(id) -> GET /catchdetails/catch/{id}.

    createDetail(data) -> POST /catchdetails.

        Constraint: Returns 409 if details already exist for that catch.

    updateDetail(id, data) -> PUT /catchdetails/{id}.

📊 Component Mapping & Relationships
Screen	Component	Relationship Logic
Species	SpeciesPage.jsx	Standard CRUD.
Catches	CatchesPage.jsx	1:N: Uses a <select> populated by speciesService.
Details	CatchDetailModal.jsx	1:1: Smart Modal (Create/Edit/Delete in one place).
💡 State Management & Optimization

To avoid unnecessary re-fetching (calling GET after every POST/PUT), apply these local state updates:
Add (POST)

Use the object returned by the API (which includes the new ID):
JavaScript

const newCatch = await createCatch(formData);
setCatches(prev => [...prev, newCatch]); // Spread operator

Update (PUT)

Since PUT returns 204 No Content, use your local form data to update the list:
JavaScript

await updateSpecies(id, speciesData);
setSpecies(prev => prev.map(s => s.id === id ? { ...s, ...speciesData } : s));

Delete (DELETE)
JavaScript

await deleteCatch(id);
setCatches(prev => prev.filter(c => c.id !== id));

⚠️ Key Business Rules (Backend Specifics)

    The 404 "Not Found" Pattern: When opening the Detail Modal, a 404 error from getDetailByCatchId means the catch has no details yet. Treat this as "Create Mode" (show a yellow banner) rather than a system error.

    Error Handling: Use the backend error messages in your Toasts:
    JavaScript

    // Use the exact property "error" returned by the C# controller
    const msg = error.response?.data?.error || "An unexpected error occurred";
    toast.error(msg);

    Derived State: Use a boolean const hasDetails = !!detailData to toggle between the "Add Details" button and the "Edit Details" view.

📂 Project Structure
Plaintext

src/
├── components/
│   ├── species/         # Species CRUD
│   ├── catches/         # Catches CRUD + Species Select
│   │   ├── CatchDetailModal.jsx # The Smart 1:1 Modal
│   ├── ui/              # Modal.jsx, Toast.jsx, ConfirmDialog.jsx
├── services/            # speciesService.js, catchService.js, etc.
├── hooks/               # useToast.js
└── contexts/            # ToastContext.jsx
