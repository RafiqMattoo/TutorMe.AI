using FluentValidation;

namespace VidyaAI.Application.Videos.Queries.GetVideos;

public sealed class GetVideosQueryValidator
    : AbstractValidator<GetVideosQuery>
{
    public GetVideosQueryValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThan(0)
            .WithMessage("Page must be greater than zero.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 200)
            .WithMessage("Page size must be between 1 and 200.");
    }
}