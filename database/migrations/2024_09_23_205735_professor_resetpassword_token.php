<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('professor_resetpassword_tokens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('professor_id');
            $table->string('token');
            $table->timestamps();
            $table->foreign('professor_id')->references('professor_id')->on('professors')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professor_resetpassword_tokens');
    }
};
