<?php

    namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
     public function index()
    {
        return response()->json(Contact::latest()->get(), 200);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string'
        ]);

        Contact::create($validated);

        return response()->json(['message' => 'Contact message saved successfully.'], 201);
    }

    public function destroy($id)
{
    $contact = Contact::find($id);

    if (!$contact) {
        return response()->json(['message' => 'Contact not found.'], 404);
    }

    $contact->delete();

    return response()->json(['message' => 'Contact deleted successfully.'], 200);
}

}
