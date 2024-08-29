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
        Schema::create('evaluation_moments', function (Blueprint $table) {
            $table->id('evaluation_moment_id');
            $table->enum('type', ['Exame', 'Trabalho', 'Exame Recurso']);
            $table->foreignId('course_id')->constrained('courses', 'course_id')->onDelete('cascade');
            $table->foreignId('professor_id')->constrained('professors', 'professor_id')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('modules', 'module_id')->onDelete('cascade');
            $table->foreignId('submodule_id')->constrained('submodules', 'submodule_id')->nullable()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluation_moments');
    }
};
