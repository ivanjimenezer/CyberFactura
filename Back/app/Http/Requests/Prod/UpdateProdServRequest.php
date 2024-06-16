<?php

namespace App\Http\Requests\Prod;

// 1.- HICE ESTOS IMPORTS
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException; 

class UpdateProdServRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    { 
        return [
            'Nombre' => 'required|string|max:65',
            'ClaveSAT' => 'required|string|max:45',
            'ClaveInv' => 'required|string|max:15',
            'PrecioUnitario' => 'required|numeric|between:0,9999999.99',
            'ClaveUnidadSAT' => 'required|string|max:45',
            'Unidad' => 'required|string|max:45',
            'Tipo' => 'required|string|'
        ]; 
    }

    public function messages(): array
    {
        return [
            'Nombre.required' => 'El nombre es obligatorio.',
            'Nombre.string' => 'El nombre debe ser una cadena de caracteres.',
            'Nombre.max' => 'El nombre no puede tener más de 65 caracteres.',
            'ClaveSAT.required' => 'La clave SAT es obligatoria.',
            'ClaveSAT.string' => 'La clave SAT debe ser una cadena de caracteres.',
            'ClaveSAT.max' => 'La clave SAT no puede tener más de 45 caracteres.',
            'ClaveInv.required' => 'La clave de Inventario es obligatoria.',
            'ClaveInv.string' => 'La clave de Inventario debe ser una cadena de caracteres.',
            'ClaveInv.max' => 'La clave de Inventario no puede tener más de 15 caracteres.',
            'PrecioUnitario.required' => 'El precio unitario es obligatorio.',
            'PrecioUnitario.numeric' => 'El precio unitario debe ser un valor numérico.',
            'ClaveUnidadSAT.required' => 'La clave de unidad SAT es obligatoria.',
            'ClaveUnidadSAT.string' => 'La clave de unidad SAT debe ser una cadena de caracteres.',
            'ClaveUnidadSAT.max' => 'La clave de unidad SAT no puede tener más de 45 caracteres.',
            'Unidad.required' => 'La unidad es obligatoria.',
            'Unidad.string' => 'La unidad debe ser una cadena de caracteres.',
            'Unidad.max' => 'La unidad no puede tener más de 45 caracteres.',
            'Tipo.required' => 'El tipo es obligatorio.',
            'Tipo.string' => 'El tipo debe ser una cadena de caracteres.'
        ];
    }
    
    // 2.- AGREGUE ESTA FUNCION
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(['error' => $validator->errors()], 422));
    }
}
