using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserContext db = new UserContext();
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginModel model)
        {
            if (ModelState.IsValid)
            {
                // поиск пользователя в бд
                User user = null;

                String psswrd = await db.Encrypt(model.Email, model.Password);
                user = await db.GetUsersAsync(model.Email, pass: psswrd);
                
                if (user != null)
                {
                    Session["Name"] = user.Name;
                    Session["hasImage"] = user.HasImage();
                    FormsAuthentication.SetAuthCookie(model.Email, true);
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    user = await db.GetUserE(model.Email);
                    if(user==null)
                    ModelState.AddModelError("", "There is no such user");
                    else { ModelState.AddModelError("", "Wrong password"); }
                }
            }

            return View(model);
        }
        public ActionResult Register()
        {

            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async System.Threading.Tasks.Task<ActionResult> Register(RegisterModel model,HttpPostedFileBase uploadedFile)
        {
            if (ModelState.IsValid)
            {
                User user = null;
                //user = db.Users.Find(new FilterDefinitionBuilder<User>().Regex("Email", new BsonRegularExpression(model.Email))).ToList()[0];

                user = await db.GetUserE(model.Email);
                if (user == null)
                {
                    String psswrd = await db.Encrypt(model.Email, model.Password);

                    Session["hasImage"] = false;

                    Session["Name"] = model.Name;
                    await db.Create(new User { Email = model.Email, Password = psswrd, Name = model.Name, Number = model.Number, DateOfBirth = model.DateOfBirth });
                    if (uploadedFile != null)
                    {

                        Session["hasImage"] = true;
                        await db.StoreImage(model.Email, uploadedFile.InputStream, uploadedFile.FileName);
                    }
                    FormsAuthentication.SetAuthCookie(model.Email, true);
                    return RedirectToAction("Index", "Home");

                }
                else
                {
                    ModelState.AddModelError("", "User with this login is existing");
                }
            }
            return View(model);
        }
        [Authorize]
        public async Task<ActionResult> LogOut()
        {
            FormsAuthentication.SignOut();
            Session.Abandon();
            return RedirectToAction("Login", "Account");
        }
        public async Task<ActionResult> GetImage()
        {
            User u = await db.GetUserE(User.Identity.Name);
            var image = await db.GetImage(u.ImageId);
            if (image == null)
            {
                return HttpNotFound();
            }
            return File(image, "image/png");
        }
        public ActionResult EditProfile()
        {
            return View();
        }
        [HttpPost]
        public async Task<ActionResult> EditProfile(UserEditModel model,HttpPostedFileBase uploadedFile)
        {
            if (model.Name != null&&model.Name!="")
            {
                await db.UpdateName(User.Identity.Name,model.Name);
                Session["Name"] = model.Name;
            }
            
            if (uploadedFile != null)
            {
                Session["hasImage"] = true;
                await db.StoreImage(User.Identity.Name, uploadedFile.InputStream, uploadedFile.FileName);
            }
            return View(model);
        }
    }

}