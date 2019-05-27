using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using System.Security.Authentication;

namespace WebApplication1.Models
{
    public class UserContext
    {

        IMongoDatabase database; // база данных
        IGridFSBucket gridFS;   // файловое хранилище

        public UserContext()
        {
            string connectionString =
         @"mongodb://streetcoders:WayE9mEkk9iuWG1VFfUeysKVhF9gSTG6kfmec4GG1E5QGfF3LMcDpJHagNKXLUbcDXg8NyEC7jjp1ndeouNSmw==@streetcoders.documents.azure.com:10255/?ssl=true";
           // connectionString = "mongodb://localhost:27017";
            //connectionString= @"mongodb://streetcoders:WayE9mEkk9iuWG1VFfUeysKVhF9gSTG6kfmec4GG1E5QGfF3LMcDpJHagNKXLUbcDXg8NyEC7jjp1ndeouNSmw==@streetcoders.documents.azure.com:10255/?ssl=true&replicaSet=globaldb";
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
        public async Task<string> Encrypt(string _login, string _password)
        {
            byte[] login = Encoding.Unicode.GetBytes(_login);
            byte[] password = Encoding.Unicode.GetBytes(_password);
            for (int i = 0; i < password.Length; i++)
                password[i] = (byte)(password[i] ^ login[i % login.Length]);
            return Encoding.Unicode.GetString(password);
        }
        // обращаемся к коллекции Phones
        public IMongoCollection<User> Users
        {
            get { return database.GetCollection<User>("Users"); }
        }
        // получаем все документы, используя критерии фильтрации
        public async Task<User> GetUsersAsync(string email, string pass)
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
        }

        // получаем один документ по id
        public async Task<User> GetUser(string id)
        {
            return await Users.Find(new BsonDocument("_id", new ObjectId(id))).FirstOrDefaultAsync();
        }
        public async Task<User> GetUserE(string email)
        {

            List<User> results = null;
            var filter = new BsonDocument("Email", new BsonDocument("$eq", email));
            results = await Users.Find<User>(filter).ToListAsync();
            if (results != null)
                return results.FirstOrDefault();
            else return null;
        }
        // добавление документа
        public async Task Create(User c)
        {
            await Users.InsertOneAsync(c);
        }
        // обновление документа
        public async Task Update(User c)
        {
            await Users.ReplaceOneAsync(new BsonDocument("_id", c.Id), c);
        }
        // удаление документа
        public async Task Remove(string id)
        {
            await Users.DeleteOneAsync(new BsonDocument("_id", new ObjectId(id)));
        }
        // получение изображения
        public async Task<byte[]> GetImage(string id)
        {
            return await gridFS.DownloadAsBytesAsync(new ObjectId(id));
        }
        // сохранение изображения
        public async Task StoreImage(string email, Stream imageStream, string imageName)
        {
            User c = await GetUserE(email);
            if (c.HasImage())
            {
                // если ранее уже была прикреплена картинка, удаляем ее
                await gridFS.DeleteAsync(new ObjectId(c.ImageId));
            }
            // сохраняем изображение
            ObjectId imageId = await gridFS.UploadFromStreamAsync(imageName, imageStream);
            // обновляем данные по документу
            c.ImageId = imageId.ToString();
            var filter = Builders<User>.Filter.Eq("Email", c.Email);
            var update = Builders<User>.Update.Set("ImageId", c.ImageId);
            await Users.UpdateOneAsync(filter, update);
        }
        public async Task UpdateName(string email, string newName)
        {
            var filter = Builders<User>.Filter.Eq("Email", email);
            var update = Builders<User>.Update.Set("Name", newName);
            await Users.UpdateOneAsync(filter, update);
        }


    }


}