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
        Schema::create('professor_in_charge_of_module', function (Blueprint $table) {
            $table->foreignId('professor_id')->constrained('professors', 'professor_id')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('modules', 'module_id')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses', 'course_id')->onDelete('cascade');
            $table->primary(['professor_id', 'module_id','course_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professor_in_charge_of_module');
    }
};
