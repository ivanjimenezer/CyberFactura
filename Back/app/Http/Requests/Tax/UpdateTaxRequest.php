<?php

namespace App\Http\Requests\Tax;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateTaxRequest extends FormRequest
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
        return [ //determinar reglas despues
            'Nombre' => 'required|string',
            'Tipo' => 'required|numeric',
            'Impuesto' => 'required|numeric',
            'Factor' => 'required|numeric',
            'Tasa' => 'required|numeric',
        ];
    }
    public function messages()
    {
        
        return [
            'Nombre.required' => 'El campo nombre es obligatorio.',
            'Tipo.required' => 'El campo tipo es obligatorio.',
            'Impuesto.required' => 'El campo impuesto es obligatorio.',
            'Factor.required' => 'El campo factor es obligatorio.',
            'Factor.numeric' => 'El campo factor debe ser númerico',
            'Tasa.required' => 'El campo tasa es obligatorio.'
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(['error' => $validator->errors()], 422));
    }
}
