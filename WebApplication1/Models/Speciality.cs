using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class Speciality
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Introduction { get; set; }
        public string Content { get; set; }
        public string Link { get; set; }
        public string ImageId { get; set; }
    }
    public class Speciality_Subject
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public string Code { get; set; }
        public string Subject { get; set; }
    }
    public class Speciality_Proffesion
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public string Code { get; set; }
        public string Proffesion { get; set; }
    }
}