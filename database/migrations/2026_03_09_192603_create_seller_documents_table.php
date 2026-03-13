<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seller_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // the seller
            $table->foreignId('property_id')->nullable()->constrained()->nullOnDelete(); // optional: tied to a listing
            $table->string('name'); // e.g. "Listing Agreement - 123 Main St"
            $table->string('category'); // listing_agreement, disclosure, government, contract, other
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->string('file_name');
            $table->unsignedBigInteger('file_size')->default(0);
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade'); // admin who uploaded
            $table->timestamp('viewed_at')->nullable(); // when seller first viewed/downloaded
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seller_documents');
    }
};
