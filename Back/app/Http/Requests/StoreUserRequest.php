<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rules\Password; 
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => [
                'required',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->symbols(),
            ],
            'type' => ['required', 'string', Rule::in(['common', 'admin'])], // Add validation rule for 'type' field
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'El campo nombre es obligatorio.',
            'name.string' => 'El campo nombre debe ser una cadena de texto.',
            'name.max' => 'El campo nombre no puede tener más de :max caracteres.',

            'email.required' => 'El campo correo electrónico es obligatorio.',
            'email.string' => 'El campo correo electrónico debe ser una cadena de texto.',
            'email.email' => 'El formato del correo electrónico no es válido.',
            'email.max' => 'El campo correo electrónico no puede tener más de :max caracteres.',
            'email.unique' => 'El correo electrónico ya está en uso.',

            'password.required' => 'El campo contraseña es obligatorio.', 
            'password.min' => 'La contraseña debe tener al menos :min caracteres.',
            'password.letters' => 'La contraseña debe contener al menos una letra.',
            'password.mixed_case' => 'La contraseña debe contener al menos una letra mayúscula y una letra minúscula.',
            'password.symbols' => 'La contraseña debe contener al menos un símbolo.',
            // Add custom error message for the 'type' field
            'type.required' => 'El campo tipo es obligatorio.',
            'type.string' => 'El campo tipo debe ser una cadena de texto.',
            'type.in' => 'El campo tipo debe ser uno de los siguientes valores: common, admin',
        ];
        
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(['error' => $validator->errors()], 422));
    }
    
}