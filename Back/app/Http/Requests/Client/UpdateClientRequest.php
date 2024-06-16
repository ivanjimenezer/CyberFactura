<?php

namespace App\Http\Requests\Client;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateClientRequest extends FormRequest
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
            'Calle' => 'nullable|string|max:55',
            'NumEx' => 'nullable|numeric',
            'NumIn' => 'nullable|max:35', 

            'Municipio' => 'nullable|string|max:45',
            'Colonia' => 'nullable|string|max:45',
            'CP' => 'required|string|max:9',
            'Estado' => 'nullable|string|max:45',
            
            'RFC' => 'required|string|max:13',
            'RazonSoc' => 'required|string|max:45',
            'Regimen' => 'required|string|max:45',
 
            'Correo' => 'required|email|max:45',
        ];
    }

    public function messages(): array
    {
        return [
            'Calle.string' => 'La calle debe ser una cadena de caracteres.',
            'Calle.max' => 'La calle no puede tener más de 55 caracteres.',
            'NumEx.numeric' => 'El número exterior debe ser un valor numérico.',
            'NumIn.max' => 'El número interior no puede tener más de 35 caracteres.',
            'Municipio.string' => 'El municipio debe ser una cadena de caracteres.',
            'Municipio.max' => 'El municipio no puede tener más de 45 caracteres.',
            'Colonia.string' => 'La colonia debe ser una cadena de caracteres.',
            'Colonia.max' => 'La colonia no puede tener más de 45 caracteres.',
            'CP.required' => 'El código postal es obligatorio.',
            'CP.string' => 'El código postal debe ser una cadena de caracteres.',
            'CP.max' => 'El código postal no puede tener más de 9 caracteres.',
            'Estado.string' => 'El estado debe ser una cadena de caracteres.',
            'Estado.max' => 'El estado no puede tener más de 45 caracteres.',
            'RFC.required' => 'El RFC es obligatorio.',
            'RFC.string' => 'El RFC debe ser una cadena de caracteres.',
            'RFC.max' => 'El RFC no puede tener más de 13 caracteres.',
            'RazonSoc.required' => 'La razón social es obligatoria.',
            'RazonSoc.string' => 'La razón social debe ser una cadena de caracteres.',
            'RazonSoc.max' => 'La razón social no puede tener más de 45 caracteres.',
            'Regimen.required' => 'El régimen es obligatorio.',
            'Regimen.string' => 'El régimen debe ser una cadena de caracteres.',
            'Regimen.max' => 'El régimen no puede tener más de 45 caracteres.',
             
            'Correo.required' => 'El correo electrónico es obligatorio.',
            'Correo.email' => 'El correo electrónico debe ser válido.',
            'Correo.max' => 'El correo electrónico no puede tener más de 45 caracteres.'
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(['error' => $validator->errors()], 422));
    }

}
