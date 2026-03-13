<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FormTemplate;
use App\Models\FormAcknowledgment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminFormTemplateController extends Controller
{
    public function index(Request $request)
    {
        $query = FormTemplate::with('uploader')->withCount('acknowledgments');

        if ($request->category && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        $templates = $query->orderBy('sort_order')->orderBy('name')->get();

        $counts = [
            'all' => FormTemplate::count(),
            'government' => FormTemplate::where('category', 'government')->count(),
            'listing' => FormTemplate::where('category', 'listing')->count(),
            'disclosure' => FormTemplate::where('category', 'disclosure')->count(),
            'brochure' => FormTemplate::where('category', 'brochure')->count(),
            'other' => FormTemplate::where('category', 'other')->count(),
        ];

        return Inertia::render('Admin/FormTemplates/Index', [
            'templates' => $templates,
            'categories' => FormTemplate::CATEGORIES,
            'filters' => $request->only(['category', 'search']),
            'counts' => $counts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|in:government,listing,disclosure,brochure,other',
            'description' => 'nullable|string|max:1000',
            'file' => 'required|file|mimes:pdf,doc,docx|max:20480', // 20MB max
            'is_required' => 'boolean',
        ]);

        $file = $request->file('file');
        $path = $file->store('forms', 'public');

        FormTemplate::create([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'description' => $validated['description'] ?? null,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'is_required' => $validated['is_required'] ?? false,
            'uploaded_by' => Auth::id(),
        ]);

        return back()->with('success', 'Form template uploaded successfully.');
    }

    public function update(Request $request, FormTemplate $formTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|in:government,listing,disclosure,brochure,other',
            'description' => 'nullable|string|max:1000',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $formTemplate->update($validated);

        return back()->with('success', 'Form template updated.');
    }

    public function destroy(FormTemplate $formTemplate)
    {
        // Delete the file
        if (Storage::disk('public')->exists($formTemplate->file_path)) {
            Storage::disk('public')->delete($formTemplate->file_path);
        }

        // Delete acknowledgments
        $formTemplate->acknowledgments()->delete();
        $formTemplate->delete();

        return back()->with('success', 'Form template deleted.');
    }

    public function download(FormTemplate $formTemplate)
    {
        $path = storage_path('app/public/' . $formTemplate->file_path);

        if (!file_exists($path)) {
            return back()->with('error', 'File not found.');
        }

        return response()->download($path, $formTemplate->file_name);
    }

    public function acknowledgments(FormTemplate $formTemplate)
    {
        $acknowledgments = $formTemplate->acknowledgments()
            ->with('user')
            ->latest('acknowledged_at')
            ->get();

        return response()->json($acknowledgments);
    }
}
