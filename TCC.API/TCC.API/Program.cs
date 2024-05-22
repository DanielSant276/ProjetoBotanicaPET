using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using TCC.API.Context;
using TCC.API.Controllers.SignalR;
using TCC.API.Models;

var builder = WebApplication.CreateBuilder(args);

// Adicionado o singleton
builder.Services.AddSingleton<GameStorage>();

// Adicionado SignalR
builder.Services.AddSignalR(options =>
{
    // Defina o tempo limite da conexão aqui
    options.ClientTimeoutInterval = TimeSpan.FromMinutes(5); // Exemplo: 5 minutos
});

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles); // ignora ciclos de referência utilizando JSON

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Coors
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("reactApp", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

var mySqlConnection = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(mySqlConnection,
    ServerVersion.AutoDetect(mySqlConnection)));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseCors(x => x.AllowAnyOrigin().AllowAnyHeader());

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.UseCors("reactApp");

app.MapHub<RoomHub>("/Roomhub");
app.MapHub<GameHub>("/Gamehub");

app.Run();
