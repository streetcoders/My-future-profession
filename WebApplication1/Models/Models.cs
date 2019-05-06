using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class LoginModel
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }

    public class RegisterModel
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.PhoneNumber)]
        public string Number { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 6, ErrorMessage = "Password should contain at least 6 symbols.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        [DataType(DataType.Password)]

        [Compare("Password", ErrorMessage = "Пароли не совпадают")]
        public string ConfirmPassword { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [DataType(DataType.ImageUrl)]
        public string ImageId { get; set; }
        public bool HasImage()
        {
            return !String.IsNullOrWhiteSpace(ImageId);
        }

    }
    public class UserEditModel
    {
        public string Name { get; set; }

        [DataType(DataType.ImageUrl)]
        public string ImageId { get; set; }

        public bool HasImage()
        {
            return !String.IsNullOrWhiteSpace(ImageId);
        }
    }
    public class FeedbackModel
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.MultilineText)]
        public string Message { get; set; }
    }
    public class ShowSpecialityModel
    {
        public string Name { get; set; }
        public string Introduction { get; set; }
        public string[] Subjects { get; set; }
        public string[] Jobs { get; set; }
        public string Content { get; set; }
    }
    public class AddSpecialityModel
    {
        [Required]
        public string Code { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]

        [DataType(DataType.MultilineText)]
        public string Introduction { get; set; }

        [Required]
        public string[] Subjects { get; set; }

        [Required]
        public string[] Jobs { get; set; }

        [Required]
        [DataType(DataType.MultilineText)]
        public string Content { get; set; }

        [Required]
        [DataType(DataType.Text)]
        public string Link { get; set; }

        [DataType(DataType.ImageUrl)]
        public string ImageId { get; set; }
    }
}