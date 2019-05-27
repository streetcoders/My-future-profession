using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Authentication;
using System.Threading.Tasks;
using System.Web;

namespace WebApplication1.Models
{
    public class SpecialityContext
    {
        IMongoDatabase database; // база данных
        IGridFSBucket gridFS;   // файловое хранилище

        public SpecialityContext()
        {
           // string connectionString =
        // @"mongodb://streetcoders:WayE9mEkk9iuWG1VFfUeysKVhF9gSTG6kfmec4GG1E5QGfF3LMcDpJHagNKXLUbcDXg8NyEC7jjp1ndeouNSmw==@streetcoders.documents.azure.com:10255/?ssl=true&replicaSet=globaldb";
            //connectionString = "mongodb://localhost:27017";
            //connectionString = @"mongodb://streetcoders:WayE9mEkk9iuWG1VFfUeysKVhF9gSTG6kfmec4GG1E5QGfF3LMcDpJHagNKXLUbcDXg8NyEC7jjp1ndeouNSmw==@streetcoders.documents.azure.com:10255/?ssl=true&replicaSet=globaldb";
           string  connectionString = @"mongodb://futuredb:ZKFb4MTdNeLpEa1ghKbd2Fuqe3aA7MmmJ9XAOXLm9xfCDWOoSsT5nEeMwusngbUEOFogFZxu2ZMvIz5Wop9EPA==@futuredb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb";
            MongoClientSettings settings = MongoClientSettings.FromUrl(
              new MongoUrl(connectionString)
            );
            settings.SslSettings =
              new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };
            var mongoClient = new MongoClient(settings);
            //var connection = new MongoUrlBuilder(connectionString);
            // получаем клиента для взаимодействия с базой данных
            MongoClient client = new MongoClient(connectionString);

            database = client.GetDatabase("test");
            // получаем доступ к файловому хранилищу
            gridFS = new GridFSBucket(database);
        }
        public IMongoCollection<Speciality> Specialities
        {
            get { return database.GetCollection<Speciality>("Specialities"); }
        }

        public IMongoCollection<Like> Likes
        {
            get { return database.GetCollection<Like>("Likes"); }
        }

        public IMongoCollection<Speciality_Subject> Specialities_Subjects
        {
            get { return database.GetCollection<Speciality_Subject>("Specialities_Subjects"); }
        }
        public async Task CreateLike(Like l)
        {
            await Likes.InsertOneAsync(l);
        }
        public long GetLikesCount(string code)
        {

            List<Like> results = new List<Like>();
            var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            results = Likes.Find<Like>(filter).ToList();
            return results.Count;
        }
        public async Task<bool> GetLikeUser(string code, string email)
        {

            List<Like> results = null;
            var filter = new BsonDocument("$and", new BsonArray{
             new BsonDocument("Code",new BsonDocument("$eq",code)),
             new BsonDocument("User",new BsonDocument("$eq", email))
            });
            results = await Likes.Find<Like>(filter).ToListAsync();
            if (results == null || results.Count <= 0)
                return false;
            else return true;
        }

        public async Task RemoveLike(string code, string email)
        {
            List<Like> results = null; var filter = new BsonDocument("$and", new BsonArray{

             new BsonDocument("Code",new BsonDocument("$eq", code)),
             new BsonDocument("User",new BsonDocument("$eq", email))
            });
            await Likes.DeleteOneAsync(filter);
        }
        public IMongoCollection<Speciality_Proffesion> Specialities_Proffesions
        {
            get { return database.GetCollection<Speciality_Proffesion>("Specialities_Proffesions"); }
        }

        public IMongoCollection<Comment_Speciality> Comment_Specialities
        {
            get { return database.GetCollection<Comment_Speciality>("Comment_Specialities"); }
        }

        public IMongoCollection<Quest_Speciality> Quest_Specialities
        {
            get { return database.GetCollection<Quest_Speciality>("Quest_Specialities"); }
        }
        public async Task CreateQuest(Quest_Speciality q)
        {
            await Quest_Specialities.InsertOneAsync(q);
        }
        public async Task<Quest_Speciality> GetQuest(string id)
        {
            List<Quest_Speciality> results = null;
            var filter = new BsonDocument("_id", new ObjectId(id));
            results = await Quest_Specialities.Find<Quest_Speciality>(filter).ToListAsync();
            if (results != null)
                return results.FirstOrDefault();
            else return null;
        }
        public async Task<List<Quest_Speciality>> GetQuests(string code)
        {
            List<Quest_Speciality> results = null;
            var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            results = await Quest_Specialities.Find<Quest_Speciality>(filter).ToListAsync();
                return results;
        }
        public async Task RemoveQuest(string id)
        {
            //var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            await Quest_Specialities.DeleteOneAsync(new BsonDocument("_id", new ObjectId(id)));
        }
        public async Task CreateComment(Comment_Speciality s)
        {
            await Comment_Specialities.InsertOneAsync(s);
        }
        public async Task<List<Comment_Speciality>> GetComments(string code)
        {

            List<Comment_Speciality> results = null;
            var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            results = await Comment_Specialities.Find<Comment_Speciality>(filter).ToListAsync();
            if (results != null)
                return results;
            else return null;
        }
        public async Task CreateSubj(string code,string[] subj)
        {
            for(int i=0;i<subj.Length;i++)
                if (subj[i] != null && subj[i] != "")
                    await Specialities_Subjects.InsertOneAsync(new Speciality_Subject{ Code = code,Subject=subj[i] });
        }
        public async Task CreateProff(string code, string[] proff)
        {
            for (int i = 0; i < proff.Length; i++)
            {
                if(proff[i]!=null&&proff[i]!="")
                await Specialities_Proffesions.InsertOneAsync(new Speciality_Proffesion { Code = code, Proffesion = proff[i] });
            }
        }

        public async Task<List<Speciality_Subject>> GetSpecialitySubjs(string code)
        {

            List<Speciality_Subject> results = null;
            var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            results = await Specialities_Subjects.Find<Speciality_Subject>(filter).ToListAsync();
            if (results != null)
                return results;
            else return null;
        }
        public async Task<List<Speciality_Proffesion>> GetSpecialityProffs(string code)
        {

            List<Speciality_Proffesion> results = null;
            var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            results = await Specialities_Proffesions.Find<Speciality_Proffesion>(filter).ToListAsync();
            if (results != null)
                return results;
            else return null;
        }
        /*public async Task<User> GetUsersAsync(string email, string pass)
        {

            List<User> results = null;
            var filter = new BsonDocument("$and", new BsonArray{

             new BsonDocument("Email",new BsonDocument("$eq", email)),
             new BsonDocument("Password", pass)
            });
            results = await Users.Find<User>(filter).ToListAsync();
            if (results != null)
                return results.FirstOrDefault();
            else return null;
        }*/

        // получаем один документ по id
        /*public async Task<User> GetUser(string id)
        {
            return await Users.Find(new BsonDocument("_id", new ObjectId(id))).FirstOrDefaultAsync();
        }*/
        public async Task<Speciality> GetSpecialityCode(string code)
        {

            List<Speciality> results = null;
            var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            results = await Specialities.Find<Speciality>(filter).ToListAsync();
            if (results != null)
                return results.FirstOrDefault();
            else return null;
        }
        public async Task<List<Speciality>> GetSpecialitiesAll()
        {

            List<Speciality> results = null;
            var filter = new BsonDocument("Code", new BsonDocument("$ne", ""));
            results = await Specialities.Find<Speciality>(filter).ToListAsync();
            if (results != null)
                return results;
            else return null;
        }
        // добавление документа
        public async Task Create(Speciality s)
        {
            await Specialities.InsertOneAsync(s);
        }
        // обновление документа
        public async Task Update(Speciality s)
        {

            var filter = new BsonDocument("_id", new BsonDocument("$eq", s.Id));
            await Specialities.ReplaceOneAsync(filter, s);
        }
        // удаление документа
        public async Task Remove(string code)
        {
            var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            await Specialities.DeleteOneAsync(filter);

            await Specialities_Proffesions.DeleteManyAsync(filter);

            await Specialities_Subjects.DeleteManyAsync(filter);
            await Comment_Specialities.DeleteManyAsync(filter);
        }
        public async Task RemoveJobs(string code)
        {
            var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            await Specialities_Proffesions.DeleteManyAsync(filter);
            
        }
        public async Task RemoveSubjects(string code)
        {
            var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            await Specialities_Subjects.DeleteManyAsync(filter);
        }
        public async Task RemoveComment(string id)
        {
            //var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            await Comment_Specialities.DeleteOneAsync(new BsonDocument("_id", new ObjectId(id)));
        }
        // получение изображения
        public async Task<byte[]> GetImage(string id)
        {
            return await gridFS.DownloadAsBytesAsync(new ObjectId(id));
        }
        // сохранение изображения
        public async Task StoreImage(string code, Stream imageStream, string imageName)
        {
            Speciality s = await GetSpecialityCode(code);
            if (s.HasImage())
            {
                await gridFS.DeleteAsync(new ObjectId(s.ImageId));
            }
            
            // сохраняем изображение
            ObjectId imageId = await gridFS.UploadFromStreamAsync(imageName, imageStream);
            // обновляем данные по документу
            s.ImageId = imageId.ToString();
            var filter = Builders<Speciality>.Filter.Eq("Code", s.Code);
            var update = Builders<Speciality>.Update.Set("ImageId", s.ImageId);
            await Specialities.UpdateOneAsync(filter, update);
        }
        /*public async Task UpdateName(string email, string newName)
        {
            var filter = Builders<User>.Filter.Eq("Email", email);
            var update = Builders<User>.Update.Set("Name", newName);
            await Users.UpdateOneAsync(filter, update);
        }*/

    }
}