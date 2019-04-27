using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class User
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Number { get; set; }
        public string Password { get; set; }
        public DateTime DateOfBirth { get; set; }
        public bool IsAdmin { get; set; }
        public string ImageId { get; set; }
        public bool HasImage()
        {
            return !String.IsNullOrWhiteSpace(ImageId);
        }
    }
    public class UserFilter
    {
        public string UserName { get; set; }
    }

    public class UserList
    {
        public IEnumerable<User> Users { get; set; }
        public UserFilter Filter { get; set; }
    }
}